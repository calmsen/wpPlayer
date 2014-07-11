define("wpPlayer", ["mejs", "text!wpPlayerCss.css", "tmpl", "text!wpPlayerTmpl.ftl", 'UI', 'shadowbox', 'toastmessage', 'browser'], function() {
    /**
     * Расширяем MediaElementPlayer. Добаввляем два метода stop, setDuration и кнопку loop. 
     */
    $.extend(mejs.MepDefaults, {
        loopText: 'Repeat',
        /**
         * Список треков
         */
        playlist: [
            /**
             * {
             *  src: "",
             *  duration: ""
             * }
             */
        ],
        playing: 0, // с какого трека начинать проигрывать плейлист
        nextTrackDefault: false, // нужно ли использовать метод nextTrack по умолчанию
        prevTrackDefault: false, // нужно ли использовать метод prevTrack по умолчанию
        mainControlsHolderId: "", // ид главного холдера
        callbacks: {
            onNextTrack: $.noop, // событие срабатывается после события nextTrack
            onPrevTrack: $.noop, // событие срабатывается после события prevTrack
            onPlay: $.noop, // событие срабатывается после события play
            onEnded: $.noop // событие срабатывается после события ended
        }
    });

    $.extend(MediaElementPlayer.prototype, {
        additionalControls: {}, //содержит дополнительные контролсы, методы и свойства для них
        stop: function() {
            var
                    t = this
                    ;
            if (!t.media.paused) {
                t.media.pause();
            }
            if (t.media.currentTime > 0) {
                t.media.setCurrentTime(0);
                t.additionalControls.current.width('0px');
                t.additionalControls.handle.css('left', '0px');
                t.additionalControls.timefloatcurrent.html(mejs.Utility.secondsToTimeCode(0));
                t.additionalControls.currenttime.html(mejs.Utility.secondsToTimeCode(0));
                t.additionalControls.revcurrenttime.html(mejs.Utility.secondsToTimeCode(t.options.duration));
                t.layers.find('.mejs-poster').show();
                //фикс - если не успел измениться класс
                t.additionalControls.playpause.removeClass('mejs-pause').addClass('mejs-play');
            }
        },
        setDuration: function(strtime) {
            var
                    t = this,
                    arrtime = strtime.replace(' ', '').split(':')
                    ;
            if (arrtime.length == 2) {
                strtime = '00:' + strtime;
            } else
            if (arrtime.length == 1) {
                strtime = '00:00' + strtime;
            }
            t.options.duration = mejs.Utility.timeCodeToSeconds(strtime);
            /*
             t.media.duration = 0;
             t.media.currentTime = 0;
             t.additionalControls.updateCurrent();
             */
        },
        buildloop: function(player, controls, layers, media) {
            var
                    t = this,
                    // create the loop button
                    loop =
                    $('<div class="mejs-button mejs-loop-button ' + ((player.options.loop) ? 'mejs-loop-on' : 'mejs-loop-off') + '">' +
                            '<button title="' + t.options.loopText + '"></button>' +
                            '</div>')
                    // append it to the toolbar
                    .appendTo(controls)
                    // add a click toggle event
                    .click(function(event) {
                        event.preventDefault();

                        player.options.loop = !player.options.loop;
                        if (player.options.loop) {
                            loop.removeClass('mejs-loop-off').addClass('mejs-loop-on');
                        } else {
                            loop.removeClass('mejs-loop-on').addClass('mejs-loop-off');
                        }
                        for (var i = 0; i < t.additionalControls.controls.length; i++) {
                            if (t.options.loop) {
                                t.additionalControls.loop.eq(i).removeClass('mejs-loop-off').addClass('mejs-loop-on');
                            } else {
                                t.additionalControls.loop.eq(i).removeClass('mejs-loop-on').addClass('mejs-loop-off');
                            }
                        }
                    });
            t.loopBtn = loop;
        },
        buildadditionalcontrols: function(player, controls, layers, media) {
            var t = this;
            t.additionalControls.document = $(document);
            //
            t.additionalControls.controls = $('#notelement');
            /* playpause */
            t.additionalControls.playpause = t.additionalControls.controls.find('.mejs-playpause-button');

            t.media.addEventListener('play', function() {
                t.additionalControls.playpause.removeClass('mejs-play').addClass('mejs-pause');
            }, false);
            t.media.addEventListener('playing', function() {
                t.additionalControls.playpause.removeClass('mejs-play').addClass('mejs-pause');
            }, false);


            t.media.addEventListener('pause', function() {
                t.additionalControls.playpause.removeClass('mejs-pause').addClass('mejs-play');
            }, false);
            t.media.addEventListener('paused', function() {
                t.additionalControls.playpause.removeClass('mejs-pause').addClass('mejs-play');
            }, false);

            /* progress */
            t.additionalControls.rail = t.additionalControls.controls.find('.mejs-time-rail');
            t.additionalControls.total = t.additionalControls.controls.find('.mejs-time-total');
            t.additionalControls.loaded = t.additionalControls.controls.find('.mejs-time-loaded');
            t.additionalControls.current = t.additionalControls.controls.find('.mejs-time-current');
            t.additionalControls.handle = t.additionalControls.controls.find('.mejs-time-handle');
            t.additionalControls.timefloat = t.additionalControls.controls.find('.mejs-time-float');
            t.additionalControls.timefloatcurrent = t.additionalControls.controls.find('.mejs-time-float-current');

            t.additionalControls.handleMouseMove = function(e) {
                for (var i = 0; i < t.additionalControls.controls.length; i++) {
                    if (t.additionalControls.rail.eq(i)[0] == t.additionalControls.elementTimeRailActive) {
                        // mouse position relative to the object
                        var x = e.pageX,
                                offset = t.additionalControls.total.eq(i).offset(),
                                width = t.additionalControls.total.eq(i).outerWidth(),
                                percentage = 0,
                                newTime = 0,
                                pos = x - offset.left;


                        if (x > offset.left && x <= width + offset.left && t.media.duration) {
                            percentage = ((x - offset.left) / width);
                            newTime = (percentage <= 0.02) ? 0 : percentage * t.media.duration;

                            // seek to where the mouse is
                            if (t.additionalControls.mouseIsDownOnTimeRail) {
                                t.media.setCurrentTime(newTime);
                            }

                            // position floating time box
                            if (!mejs.MediaFeatures.hasTouch) {
                                t.additionalControls.timefloat.eq(i).css('left', pos);
                                t.additionalControls.timefloatcurrent.eq(i).html(mejs.Utility.secondsToTimeCode(newTime));
                                t.additionalControls.timefloat.eq(i).show();
                            }
                        }
                        break;
                    }
                }
            };
            t.additionalControls.mouseIsDownOnTimeRail = false;
            t.additionalControls.mouseIsOverOnTimeRail = false;

            // loading
            t.additionalControls.setProgressRail = function(e) {

                var
                        target = (e != undefined) ? e.target : t.media,
                        percent = null;

                // newest HTML5 spec has buffered array (FF4, Webkit)
                if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {
                    // TODO: account for a real array with multiple values (only Firefox 4 has this so far) 
                    percent = target.buffered.end(0) / target.duration;
                }
                // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
                // to be anything other than 0. If the byte count is available we use this instead.
                // Browsers that support the else if do not seem to have the bufferedBytes value and
                // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
                else if (target && target.bytesTotal != undefined && target.bytesTotal > 0 && target.bufferedBytes != undefined) {
                    percent = target.bufferedBytes / target.bytesTotal;
                }
                // Firefox 3 with an Ogg file seems to go this way
                else if (e && e.lengthComputable && e.total != 0) {
                    percent = e.loaded / e.total;
                }

                // finally update the progress bar
                if (percent !== null) {
                    percent = Math.min(1, Math.max(0, percent));
                    // update loaded bar
                    if (t.additionalControls.loaded && t.additionalControls.total) {
                        for (var i = 0; i < t.additionalControls.controls.length; i++) {
                            t.additionalControls.loaded.eq(i).width(t.additionalControls.total.eq(i).width() * percent);
                        }
                    }
                }
            };
            t.additionalControls.setCurrentRail = function() {

                if (t.media.currentTime != undefined && t.media.duration) {

                    // update bar and handle
                    if (t.additionalControls.total && t.additionalControls.handle) {
                        for (var i = 0; i < t.additionalControls.controls.length; i++) {
                            var
                                    newWidth = t.additionalControls.total.eq(i).width() * t.media.currentTime / t.media.duration,
                                    handlePos = (t.additionalControls.total.eq(i).width() - t.additionalControls.handle.eq(i).outerWidth(true)) * t.media.currentTime / t.media.duration;
                            t.additionalControls.current.eq(i).width(newWidth);
                            t.additionalControls.handle.eq(i).css('left', handlePos);
                        }
                    }
                }


            };
            t.media.addEventListener('progress', function(e) {
                t.additionalControls.setProgressRail(e);
                t.additionalControls.setCurrentRail(e);
            }, false);

            t.media.addEventListener('canplay', function(e) {
            }, false);
            /* current time */
            t.media.addEventListener('timeupdate', function(e) {
                t.additionalControls.setProgressRail(e);
                t.additionalControls.setCurrentRail(e);
            }, false);

            /* current and duration time */
            t.additionalControls.currenttime = t.additionalControls.controls.find('.mejs-currenttime');
            t.additionalControls.revcurrenttime = t.additionalControls.controls.find('.mejs-revcurrenttime');
            t.additionalControls.durationD = t.additionalControls.controls.find('.mejs-duration');

            t.media.addEventListener('timeupdate', function() {
                t.additionalControls.updateCurrent();
            }, false);

            t.media.addEventListener('timeupdate', function() {
                t.additionalControls.updateDuration();
            }, false);


            t.additionalControls.updateCurrent = function() {
                if (t.additionalControls.currenttime) {
                    t.additionalControls.currenttime.html(mejs.Utility.secondsToTimeCode(t.media.currentTime, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25));
                }
                if (t.additionalControls.revcurrenttime) {
                    if (t.options.duration > 0) {
                        t.media.revCurrentTime = t.options.duration - t.media.currentTime
                    } else
                    if (t.media.duration > 0) {
                        t.media.revCurrentTime = t.media.duration - t.media.currentTime
                    }
                    else {
                        t.media.revCurrentTime = 0;
                    }
                    if (t.media.revCurrentTime < 0) {
                        t.media.revCurrentTime = 0;
                    }
                    t.additionalControls.revcurrenttime.html(mejs.Utility.secondsToTimeCode(t.media.revCurrentTime, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25));
                }
            };

            t.additionalControls.updateDuration = function() {
                if (t.media.duration && t.additionalControls.durationD) {
                    t.additionalControls.durationD.html(mejs.Utility.secondsToTimeCode(t.media.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25));
                }
            };
            /* volume */
            // Android and iOS don't support volume controls
            if (mejs.MediaFeatures.hasTouch && this.options.hideVolumeOnTouchDevices)
                return;

            t.additionalControls.mode = (t.isVideo) ? t.options.videoVolume : t.options.audioVolume;

            t.additionalControls.mute = t.additionalControls.controls.find('.mejs-volume-button');
            t.additionalControls.volumeSlider = t.additionalControls.controls.find('.mejs-volume-slider, .mejs-horizontal-volume-slider');
            t.additionalControls.volumeTotal = t.additionalControls.controls.find('.mejs-volume-total, .mejs-horizontal-volume-total');
            t.additionalControls.volumeCurrent = t.additionalControls.controls.find('.mejs-volume-current, .mejs-horizontal-volume-current');
            t.additionalControls.volumeHandle = t.additionalControls.controls.find('.mejs-volume-handle, .mejs-horizontal-volume-handle');
            t.check_launch = 0;
            t.additionalControls.positionVolumeHandle = function(volume) {
                //чтобы избежать бесконечной рекурсии
                /*if(t.check_launch > 20){
                 setTimeout(function(){
                 t.check_launch = 0;
                 },60000);
                 return;
                 }
                 t.check_launch++;*/
                if (!t.additionalControls.mute.length)
                    return;
                for (var i = 0; i < t.additionalControls.mute.length; i++) {
                    /*if (!t.additionalControls.volumeSlider.eq(i).is(':visible')) {
                     t.additionalControls.volumeSlider.eq(i).show();
                     t.additionalControls.positionVolumeHandle(volume);
                     t.additionalControls.volumeSlider.eq(i).hide()
                     return;
                     }
                     t.check_launch = 0;*/
                    // correct to 0-1
                    volume = Math.max(0, volume);
                    volume = Math.min(volume, 1);

                    // ajust mute button style
                    if (volume == 0) {
                        t.additionalControls.mute.eq(i).removeClass('mejs-mute').addClass('mejs-unmute');
                    } else {
                        t.additionalControls.mute.eq(i).removeClass('mejs-unmute').addClass('mejs-mute');
                    }

                    // position slider 
                    if (t.additionalControls.volumeSlider.eq(i).is('.mejs-volume-slider')) {
                        var
                                // height of the full size volume slider background
                                totalHeight = t.additionalControls.volumeTotal.eq(i).height(),
                                // top/left of full size volume slider background
                                totalPosition = t.additionalControls.volumeTotal.eq(i).position(),
                                // the new top position based on the current volume
                                // 70% volume on 100px height == top:30px
                                newTop = totalHeight - (totalHeight * volume);

                        // handle
                        t.additionalControls.volumeHandle.eq(i).css('top', totalPosition.top + newTop - (t.additionalControls.volumeHandle.eq(i).height() / 2));

                        // show the current visibility
                        t.additionalControls.volumeCurrent.eq(i).height(totalHeight - newTop);
                        t.additionalControls.volumeCurrent.eq(i).css('top', totalPosition.top + newTop);
                    } else {
                        var
                                // height of the full size volume slider background
                                totalWidth = t.additionalControls.volumeTotal.eq(i).width(),
                                // top/left of full size volume slider background
                                totalPosition = t.additionalControls.volumeTotal.eq(i).position(),
                                // the new left position based on the current volume
                                newLeft = totalWidth * volume;

                        // handle
                        //t.additionalControls.volumeHandle.eq(i).css('left', totalPosition.left + newLeft - (t.additionalControls.volumeHandle.eq(i).width() / 2));
                        t.additionalControls.volumeHandle.eq(i).css('left', totalPosition.left + ((totalWidth - t.additionalControls.volumeHandle.eq(i).width()) * volume));
                        // rezize the current part of the volume bar
                        t.additionalControls.volumeCurrent.eq(i).width(newLeft);
                    }
                }
            };
            t.additionalControls.handleVolumeMove = function(e) {
                for (var i = 0; i < t.additionalControls.mute.length; i++) {
                    if (t.additionalControls.volumeSlider.eq(i)[0] == t.additionalControls.elementVolumeSliderActive) {
                        var volume = null,
                                totalOffset = t.additionalControls.volumeTotal.eq(i).offset();

                        // calculate the new volume based on the moust position
                        if (t.additionalControls.volumeSlider.eq(i).is('.mejs-volume-slider')) {

                            var
                                    railHeight = t.additionalControls.volumeTotal.eq(i).height(),
                                    totalTop = parseInt(t.additionalControls.volumeTotal.eq(i).css('top').replace(/px/, ''), 10),
                                    newY = e.pageY - totalOffset.top;

                            volume = (railHeight - newY) / railHeight;

                            // the controls just hide themselves (usually when mouse moves too far up)
                            if (totalOffset.top == 0 || totalOffset.left == 0)
                                return;

                        } else {
                            var
                                    railWidth = t.additionalControls.volumeTotal.eq(i).width(),
                                    newX = e.pageX - totalOffset.left;

                            volume = newX / railWidth;
                        }

                        // ensure the volume isn't outside 0-1
                        volume = Math.max(0, volume);
                        volume = Math.min(volume, 1);

                        // position the slider and handle			
                        t.additionalControls.positionVolumeHandle(volume);

                        // set the media object (this will trigger the volumechanged event)
                        if (volume == 0) {
                            t.media.setMuted(true);
                        } else {
                            t.media.setMuted(false);
                        }
                        t.media.setVolume(volume);
                        break;
                    }
                }

            };
            t.additionalControls.mouseIsDownOnVolumeSlider = false;
            t.additionalControls.mouseIsOverOnVolumeSlider = false;

            // listen for volume change events from other sources
            t.media.addEventListener('volumechange', function(e) {
                if (!t.additionalControls.mouseIsDownOnVolumeSlider) {
                    if (t.media.muted) {
                        t.additionalControls.positionVolumeHandle(0);
                        t.additionalControls.mute.removeClass('mejs-mute').addClass('mejs-unmute');
                    } else {
                        t.additionalControls.positionVolumeHandle(t.media.volume);
                        t.additionalControls.mute.removeClass('mejs-unmute').addClass('mejs-mute');
                    }
                }
            }, false);
            //stop	
            t.additionalControls.stop = t.additionalControls.controls.find('.mejs-stop');
            //fullscreen
            t.additionalControls.fullscreen = t.additionalControls.controls.find('.mejs-fullscreen-button');
            //loop
            t.additionalControls.loop = t.additionalControls.controls.find('.mejs-loop-button');
            //playlist
            t.additionalControls.playlist = t.additionalControls.controls.find('.mejs-playlist-button');
            //prev and next
            t.additionalControls.prev = t.additionalControls.controls.find('.mejs-prev-button');
            t.additionalControls.next = t.additionalControls.controls.find('.mejs-next-button');
            
            t.additionalControls.loadAndPlay = function(src, duration) {
                t.additionalControls.load(src, duration);
                t.additionalControls.player.play();
            };

            t.additionalControls.load = function(src, duration) {
                t.setDuration(duration);

                var srcMp3 = src;
                var srcOgg = src.replace('/mp3/', '/ogg/').replace('.mp3', '.ogg');

                t.pause();
                /**
                 * фикс для хрома - ogg формат нужно указать первым
                 */
                t.setSrc([{src: srcOgg, type: 'audio/ogg'}, {src: srcMp3, type: 'audio/mp3'}]);
                t.load();
            };
            t.additionalControls.prevTrack = function(e) {
                if (t.options.prevTrackDefault) {
                    if (t.options.playlist[t.options.playing - 1] !== undefined) {
                        t.options.playing = t.options.playing - 1;
                    } else {
                        t.options.playing = t.options.playlist.length - 1;
                    }
                    t.additionalControls.loadAndPlay(t.options.playlist[t.options.playing].src, t.options.playlist[t.options.playing].duration);
                }
                t.options.callbacks.onPrevTrack(e);
            };
            t.additionalControls.nextTrack = function(e) {
                if (t.options.nextTrackDefault) {
                    if (t.options.playlist[t.options.playing + 1] !== undefined) {
                        t.options.playing = t.options.playing + 1;
                    } else {
                        t.options.playing = 0;
                    }
                    t.additionalControls.loadAndPlay(t.options.playlist[t.options.playing].src, t.options.playlist[t.options.playing].duration);
                }
                t.options.callbacks.onNextTrack(e);
            }
            //
            t.media.addEventListener('play', t.options.callbacks.onPlay);
            t.media.addEventListener('ended', t.options.callbacks.onEnded);
        },
        clearControls: function() {
            var
                    t = this
                    ;
            t.additionalControls.controls.each(function() {
                //удалим не существующие элементы
                var id = this.id;
                if (id != t.options.mainControlsHolderId) {
                    if ($('#' + id).length == 0) {
                        t.removeControls(this)
                    }
                }

            })
        },
        addControls: function(selector) {
            var
                    t = this
            $els = t.additionalControls.document.find(selector)
                    ;
            if ($els.length == 0) {
                return;
            }
            t.additionalControls.document.unbind('mousemove.player').unbind('mouseup.player');
            t.clearControls();
            t.additionalControls.controls = t.additionalControls.controls.add($els);
            t.additionalControls.buttons = t.additionalControls.controls.find('button');
            t.additionalControls.buttons
                    .bind('click.default', function(event) {
                        event.preventDefault();
                    });
            /* playpause */
            t.additionalControls.playpause = t.additionalControls.controls.find('.mejs-playpause-button');
            if (t.additionalControls.playIsDisabled == undefined) {
                t.additionalControls.playIsDisabled = false;
            }
            //init
            if (t.media.paused) {
                t.additionalControls.playpause.removeClass('mejs-pause').addClass('mejs-play')
            } else {
                t.additionalControls.playpause.removeClass('mejs-play').addClass('mejs-pause')
            }
            t.additionalControls.playpause
                    .unbind('click.player').bind('click.player', function(e) {
                e.preventDefault();
                if (!t.additionalControls.playIsDisabled) {
                    if (t.media.paused) {
                        t.media.play();
                    } else {
                        t.media.pause();
                    }
                }
                return false;
            });
            /* progress */
            t.additionalControls.rail = t.additionalControls.controls.find('.mejs-time-rail');
            t.additionalControls.total = t.additionalControls.controls.find('.mejs-time-total');
            t.additionalControls.loaded = t.additionalControls.controls.find('.mejs-time-loaded');
            t.additionalControls.current = t.additionalControls.controls.find('.mejs-time-current');
            t.additionalControls.handle = t.additionalControls.controls.find('.mejs-time-handle');
            t.additionalControls.timefloat = t.additionalControls.controls.find('.mejs-time-float');
            t.additionalControls.timefloatcurrent = t.additionalControls.controls.find('.mejs-time-float-current');
            t.additionalControls.mouseIsDownOnTimeRail = false;
            t.additionalControls.mouseIsOverOnTimeRail = false;
            t.additionalControls.elementTimeRailActive = '';
            t.additionalControls.document
                    .bind('mousemove.player', function(e) {
                        if (t.additionalControls.mouseIsDownOnTimeRail || t.additionalControls.mouseIsOverOnTimeRail) {
                            t.additionalControls.handleMouseMove(e);
                        }
                    })
                    .bind('mouseup.player', function(e) {
                        t.additionalControls.mouseIsDownOnTimeRail = false;
                        for (var i = 0; i < t.additionalControls.controls.length; i++) {
                            if (t.additionalControls.rail.eq(i)[0] == t.additionalControls.elementTimeRailActive) {
                                t.additionalControls.timefloat.eq(i).hide();
                            }
                        }
                        //handleMouseMove(e);
                    })
            t.additionalControls.rail
                    .unbind('mousedown.player').bind('mousedown.player', function(e) {
                // only handle left clicks
                if (e.which === 1) {
                    t.additionalControls.mouseIsDownOnTimeRail = true;
                    t.additionalControls.handleMouseMove(e);
                    return false;
                }
            })
                    .unbind('mouseenter.player').bind('mouseenter.player', function(e) {
                t.additionalControls.elementTimeRailActive = this;
                t.additionalControls.mouseIsOverOnTimeRail = true;
                if (!mejs.MediaFeatures.hasTouch) {
                    for (var i = 0; i < t.additionalControls.controls.length; i++) {
                        if (t.additionalControls.rail.eq(i)[0] == t.additionalControls.elementTimeRailActive) {
                            t.additionalControls.timefloat.eq(i).show();
                        }
                    }

                }
            })
                    .unbind('mouseleave.player').bind('mouseleave.player', function(e) {
                t.additionalControls.mouseIsOverOnTimeRail = false;
                for (var i = 0; i < t.additionalControls.controls.length; i++) {
                    if (t.additionalControls.rail.eq(i)[0] == t.additionalControls.elementTimeRailActive) {
                        t.additionalControls.timefloat.eq(i).hide();
                    }
                }
                ;
                //t.additionalControls.elementTimeRailActive = '';
            });
            /* current and duration time */
            t.additionalControls.currenttime = t.additionalControls.controls.find('.mejs-currenttime');

            t.additionalControls.currenttime.html((t.options.alwaysShowHours ? '00:' : '') + (t.options.showTimecodeFrameCount ? '00:00:00' : '00:00'));

            t.additionalControls.revcurrenttime = t.additionalControls.controls.find('.mejs-revcurrenttime');

            t.additionalControls.revcurrenttime.html((t.options.duration > 0 ?
                    mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25) :
                    ((t.options.alwaysShowHours ? '00:' : '') + (t.options.showTimecodeFrameCount ? '00:00:00' : '00:00'))));

            t.additionalControls.durationD = t.additionalControls.controls.find('.mejs-duration');

            t.additionalControls.durationD.html((t.options.duration > 0 ?
                    mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount, t.options.framesPerSecond || 25) :
                    ((t.options.alwaysShowHours ? '00:' : '') + (t.options.showTimecodeFrameCount ? '00:00:00' : '00:00'))));
            //init
            t.additionalControls.updateCurrent();
            t.additionalControls.updateDuration();
            /* volume */
            t.additionalControls.mute = t.additionalControls.controls.find('.mejs-volume-button');
            t.additionalControls.volumeSlider = t.additionalControls.controls.find('.mejs-volume-slider, .mejs-horizontal-volume-slider');
            t.additionalControls.volumeTotal = t.additionalControls.controls.find('.mejs-volume-total, .mejs-horizontal-volume-total');
            t.additionalControls.volumeCurrent = t.additionalControls.controls.find('.mejs-volume-current, .mejs-horizontal-volume-current');
            t.additionalControls.volumeHandle = t.additionalControls.controls.find('.mejs-volume-handle, .mejs-horizontal-volume-handle');

            //init
            if (t.media.muted) {
                t.additionalControls.mute.removeClass('mejs-mute').addClass('mejs-unmute');
            }
            else {
                t.additionalControls.mute.removeClass('mejs-unmute').addClass('mejs-mute');
            }
            t.additionalControls.positionVolumeHandle(t.media.volume);

            t.additionalControls.elementMuteActive = '';
            t.additionalControls.mouseIsOverOnMute = false
            t.additionalControls.mute
                    .unbind('mouseenter.player').bind('mouseenter.player', function() {
                t.additionalControls.elementMuteActive = this;
                for (var i = 0; i < t.additionalControls.mute.length; i++) {
                    if (t.additionalControls.mute.eq(i)[0] == this && t.additionalControls.volumeSlider.eq(i).is('.mejs-volume-slider')) {
                        t.additionalControls.volumeSlider.eq(i).show();
                    }
                }
                t.additionalControls.mouseIsOverOnMute = true;
            })
                    .unbind('mouseleave.player').bind('mouseleave.player', function() {
                t.additionalControls.mouseIsOverOnMute = false;
                for (var i = 0; i < t.additionalControls.mute.length; i++) {
                    if (t.additionalControls.mute.eq(i)[0] == this) {
                        if (!t.additionalControls.mouseIsDownOnVolumeSlider && t.additionalControls.volumeSlider.eq(i).is('.mejs-volume-slider')) {
                            t.additionalControls.volumeSlider.eq(i).hide();
                        }
                    }
                }
                //t.additionalControls.elementMuteActive = '';
            });
            t.additionalControls.mouseIsDownOnVolumeSlider = false;
            t.additionalControls.mouseIsOverOnVolumeSlider = false;
            t.additionalControls.elementVolumeSliderActive = '';
            t.additionalControls.document
                    .bind('mousemove.player', function(e) {
                        if (t.additionalControls.mouseIsDownOnVolumeSlider) {
                            t.additionalControls.handleVolumeMove(e);
                        }
                    })
                    .bind('mouseup.player', function(e) {
                        t.additionalControls.mouseIsDownOnVolumeSlider = false;
                        for (var i = 0; i < t.additionalControls.mute.length; i++) {
                            if (t.additionalControls.mute.eq(i)[0] == t.additionalControls.elementMuteActive) {
                                if (!t.additionalControls.mouseIsOverOnVolumeSlider && t.additionalControls.volumeSlider.eq(i).is('.mejs-volume-slider')) {
                                    t.additionalControls.volumeSlider.eq(i).hide();
                                }
                            }
                        }
                    });
            t.additionalControls.volumeSlider
                    .unbind('mouseenter.player').bind('mouseenter.player', function() {
                t.additionalControls.elementVolumeSliderActive = this;
                t.additionalControls.mouseIsOverOnVolumeSlider = true;
            })
                    .unbind('mouseleave.player').bind('mouseleave.player', function() {
                t.additionalControls.mouseIsOverOnVolumeSlider = false;
                //t.additionalControls.elementVolumeSliderActive = '';
            })
                    .unbind('mousedown.player').bind('mousedown.player', function(e) {
                
                t.clearControls();
                t.additionalControls.handleVolumeMove(e);
                t.additionalControls.mouseIsDownOnVolumeSlider = true;
                return false;
            })
                    ;

            t.additionalControls.mute.find('button')
                    .unbind('click.player').bind('click.player', function() {
                t.media.setMuted(!t.media.muted);
            });
            /* stop */
            t.additionalControls.stop = t.additionalControls.controls.find('.mejs-stop')
            t.additionalControls.stop
                    .unbind('click.player').bind('click.player', function() {
                if (!t.media.paused) {
                    t.media.pause();
                }
                if (t.media.currentTime > 0) {
                    t.media.setCurrentTime(0);
                    t.additionalControls.current.width('0px');
                    t.additionalControls.handle.css('left', '0px');
                    t.additionalControls.timefloatcurrent.html(mejs.Utility.secondsToTimeCode(0));
                    t.additionalControls.currenttime.html(mejs.Utility.secondsToTimeCode(0));
                    t.additionalControls.revcurrenttime.html(mejs.Utility.secondsToTimeCode(t.options.duration));
                    t.layers.find('.mejs-poster').show();
                }
            })
                    ;
            /* fullscreen; borrow by player */
            t.additionalControls.fullscreen = t.additionalControls.controls.find('.mejs-fullscreen-button')
                    .unbind('click.player').bind('click.player', function() {

                t.fullscreenBtn.click();
            })
                    ;
            /* loop */
            t.additionalControls.loop = t.additionalControls.controls.find('.mejs-loop-button')
            t.additionalControls.loop
                    .unbind('click.player').bind('click.player', function() {
                t.options.loop = !t.options.loop;
                if (t.options.loop) {
                    t.loopBtn.removeClass('mejs-loop-off').addClass('mejs-loop-on');
                } else {
                    t.loopBtn.removeClass('mejs-loop-on').addClass('mejs-loop-off');
                }

                for (var i = 0; i < t.additionalControls.controls.length; i++) {
                    if (t.options.loop) {
                        t.additionalControls.loop.eq(i).removeClass('mejs-loop-off').addClass('mejs-loop-on');
                    } else {
                        t.additionalControls.loop.eq(i).removeClass('mejs-loop-on').addClass('mejs-loop-off');
                    }
                }
            })
                    .removeClass('mejs-loop-off').addClass(((t.options.loop) ? 'mejs-loop-on' : 'mejs-loop-off'))
                    ;
            /* playlist */
            t.additionalControls.playlist = t.additionalControls.controls.find('.mejs-playlist-button');
            if (wpUser.id) {
                t.additionalControls.playlist
                        .unbind('click.player').bind('click.player', function() {
                    if (t.additionalControls.controls.is('.mejs-open-playlist')) {
                        t.additionalControls.controls.removeClass('mejs-open-playlist');
                        if ($.browser.firefox) {
                            $(this).removeClass('mejs-playlist-press');
                        }


                    }
                    else {
                        t.additionalControls.controls.addClass('mejs-open-playlist');
                    }
                })
                        ;

            }
            /* prev and next */
            t.additionalControls.prev = t.additionalControls.controls.find('.mejs-prev-button');
            if (t.additionalControls.prevIsDisabled == undefined) {
                t.additionalControls.prevIsDisabled = false;
            }
            t.additionalControls.prev
                    .unbind('click.player').bind('click.player', function(event) {
                if (!t.additionalControls.prevIsDisabled) {
                    if (t.options.loop) {
                        t.options.loop = false;
                        t.loopBtn.removeClass('mejs-loop-on').addClass('mejs-loop-off');
                        for (var i = 0; i < t.additionalControls.controls.length; i++) {
                            t.additionalControls.loop.eq(i).removeClass('mejs-loop-on').addClass('mejs-loop-off');
                        }
                    }
                    t.additionalControls.prevTrack(event);
                }
            });
            t.additionalControls.next = t.additionalControls.controls.find('.mejs-next-button');
            if (t.additionalControls.nextIsDisabled == undefined) {
                t.additionalControls.nextIsDisabled = false;
            }
            t.additionalControls.next
                    .unbind('click.player').bind('click.player', function(event) {
                if (!t.additionalControls.nextIsDisabled) {
                    if (t.options.loop) {
                        t.options.loop = false;
                        t.loopBtn.removeClass('mejs-loop-on').addClass('mejs-loop-off');
                        for (var i = 0; i < t.additionalControls.controls.length; i++) {
                            t.additionalControls.loop.eq(i).removeClass('mejs-loop-on').addClass('mejs-loop-off');
                        }
                    }
                    t.additionalControls.nextTrack(event);
                }
            });
            /*if(selector == '#wp_player_main_controls'){
             setTimeout(function(){$('#wp_player_main_controls').addClass('mini')},3000)
             
             }*/

        },
        removeControls: function(selector) {
            var t = this;
            t.additionalControls.buttons = t.additionalControls.controls.filter(selector).find('button')
                    .unbind('click.default');

            /* playpause */
            t.additionalControls.playpause = t.additionalControls.controls.filter(selector).find('.mejs-button.mejs-playpause-button')
                    .unbind('click.player')
                    ;
            /* progress */
            t.additionalControls.rail = t.additionalControls.controls.filter(selector).find('.mejs-time-total')
                    .unbind('mousedown.player')
                    .unbind('mouseup.player')
                    .unbind('mousemove.player')
                    .unbind('mouseenter.player')
                    .unbind('mouseleave.player')
                    ;
            /* volume */
            t.additionalControls.mute = t.additionalControls.controls.filter(selector).find('.mejs-volume-button')
                    .unbind('mouseenter.player')
                    .unbind('mouseleave.player')
                    ;
            t.additionalControls.volumeSlider = t.additionalControls.controls.filter(selector).find('.mejs-volume-slider, .mejs-horizontal-volume-slider')
                    .unbind('mouseover.player')
                    .unbind('mousedown.player')
                    .unbind('mouseup.player')
                    .unbind('mousemove.player')
                    ;
            t.additionalControls.mute = t.additionalControls.controls.filter(selector).find('.mejs-volume-button')
                    .unbind('click.player')
                    ;
            //stop
            t.additionalControls.stop = t.additionalControls.controls.filter(selector).find('.mejs-stop')
                    .unbind('click.player')
                    ;
            //fullscreen
            t.additionalControls.fullscreen = t.additionalControls.controls.filter(selector).find('.mejs-fullscreen-button')
                    .unbind('click.player')
                    ;
            //loop
            t.additionalControls.loop = t.additionalControls.controls.filter(selector).find('.mejs-loop-button')
                    .unbind('click.player')
                    ;
            //playlist
            t.additionalControls.playlist = t.additionalControls.controls.filter(selector).find('.mejs-playlist-button')
                    .unbind('click.player')
                    ;
            //prev and next
            t.additionalControls.prev = t.additionalControls.controls.filter(selector).find('.mejs-prev-button')
                    .unbind('click.player')
                    ;
            t.additionalControls.next = t.additionalControls.controls.filter(selector).find('.mejs-next-button')
                    .unbind('click.player')
                    ;
            /////////////
            t.additionalControls.controls = t.additionalControls.controls.not(selector);

            t.additionalControls.buttons = t.additionalControls.controls.find('button');
            /* playpause */
            t.additionalControls.playpause = t.additionalControls.controls.find('.mejs-button.mejs-playpause-button');
            /* progress */
            t.additionalControls.rail = t.additionalControls.controls.find('.mejs-time-rail');
            t.additionalControls.total = t.additionalControls.controls.find('.mejs-time-total');
            t.additionalControls.loaded = t.additionalControls.controls.find('.mejs-time-loaded');
            t.additionalControls.current = t.additionalControls.controls.find('.mejs-time-current');
            t.additionalControls.handle = t.additionalControls.controls.find('.mejs-time-handle');
            t.additionalControls.timefloat = t.additionalControls.controls.find('.mejs-time-float');
            t.additionalControls.timefloatcurrent = t.additionalControls.controls.find('.mejs-time-float-current');
            /* current and duration time */
            t.additionalControls.currenttime = t.additionalControls.controls.find('.mejs-currenttime');
            t.additionalControls.revcurrenttime = t.additionalControls.controls.find('.mejs-revcurrenttime');
            t.additionalControls.durationD = t.additionalControls.controls.find('.mejs-duration');
            /* volume */
            t.additionalControls.mute = t.additionalControls.controls.find('.mejs-volume-button');
            t.additionalControls.volumeSlider = t.additionalControls.controls.find('.mejs-volume-slider, .mejs-horizontal-volume-slider');
            t.additionalControls.volumeTotal = t.additionalControls.controls.find('.mejs-volume-total, .mejs-horizontal-volume-total');
            t.additionalControls.volumeCurrent = t.additionalControls.controls.find('.mejs-volume-current, .mejs-horizontal-volume-current');
            t.additionalControls.volumeHandle = t.additionalControls.controls.find('.mejs-volume-handle, .mejs-horizontal-volume-handle');
            //stop
            t.additionalControls.stop = t.additionalControls.controls.find('.mejs-stop');
            //fullscreen
            t.additionalControls.fullscreen = t.additionalControls.controls.find('.mejs-fullscreen-button');
            //loop
            t.additionalControls.loop = t.additionalControls.controls.find('.mejs-loop-button');
            //playlist
            t.additionalControls.playlist = t.additionalControls.controls.find('.mejs-playlist-button');
            //prev and next
            t.additionalControls.prev = t.additionalControls.controls.find('.mejs-prev-button');
            t.additionalControls.next = t.additionalControls.controls.find('.mejs-next-button');
        }
    });
    /**
     * Работаем с плеером worldpage. Описываем main_controls, second_controls и playlist
     */
    wpPlayer = {};
    wpPlayer.document = $(document); // создадим jQuery объект только один раз
    wpPlayer.ajax_active = false; // запрещает посылать аякс запросы одновременно
    /**
     * @type {MediaElementPlayer}
     */
    wpPlayer.player; // непосредственно сам плеер
    wpPlayer.is_ready_player = false; // создан ли wpPlayer.player
    wpPlayer.second_controls_active = ''; // ид активного трека(на странице)
    wpPlayer.main_controls_active = ''; // ид главного плеера
    wpPlayer.do_controls_class_is_type = true; // показывает на странице, откуда проигрывается трек, с настоящего плейлиста(native) или с плейлиста со страницы(container)
    wpPlayer.create_for_all_track = true;//создать плейлист из всех треков на странице, то есть из всех контейнеров(если установлен false, то создается с одного контейнера)
    wpPlayer.isPlaylistRepeatPlay = false;
    wpPlayer.check_count_preview = true;
    
    wpPlayer.settings = {
        /**
         * список треков на странице
         */
        tracks: [
            /**
             * {
             *  track_id: 0 // ид трека
             *  , object_id: 0 ид трека, должен быть равен track_id. !издержки)
             *  , album_id: 0 ид альбома. может быть равен всегда 0. !издержки)
             *  , perfomer_name: "" // имя исполнителя
             *  , track_title: "" // название трека
             *  , src: ""  путь до mp3 файла
             *  , track_duration: "" // длительность трека 
             *  , track_video: "" // ид видео youtube
             *  , like_id: "" // like_id - поставлен ли лайк. Равен 0 или user_id 
             *  , user_id: "" // владелец трека (аналон sign)
             *  , track_content_exist: false // есть ли текст песни.
             *  , track_content: "" // текст песни. После запроса к серверу(только если track_content_exist будет равен true) данное поле заполняется значением
             * }
             */
        ]
        /**
         * список плейлистов
         */
        , playlists: [
            /**
             * {
             *  id: 0 // ид плейлиста
             *  , playlist: [] // список треков в плейлисте
             *  , active: 0 // активный плейлист(например тот который редактируется или просматривается в плейлист баре)
             *  , playing // плейлист тот который играет (необязательно соответсвует плейлисту active )
             *  , title: "" // заголовок плейлиста
             *  , type: "" // тип плейлиста
             *  , user_id: 0 // владелец плейлиста(аналон sign)
             *  , my_id: 0 // сессионный пользователь(аналон user.id)
             *  , perfomer_id: 0 // исполнитель. Значение не пустое тогда когда владелец является исполнителем
             *  , community_id: 0 // сообщество. Значение не пустое тогда когда владелец является владельцем или админом сообщества
             * }
             */
        ]
        , playing_playlist: {//плейлист может быть создан из списка треков, он не заноситься в списки t.additionalControls.playlists
            playlist: []
            , active: 0
            , playing: 0
            , id: 0
            , type: 'native'
        }
        , current_playlist: {//относиться только к настоящим плейлистам. Например тот плейлист который открыт для редактирования
            playlist: [],
            active: 0,
            playing: 0,
            id: 0,
            type: 'native'
        }
    };
    
    wpPlayer.init = function(options) {
        $.extend(wpPlayer, wpPlayer.settings, options);
        
        wpPlayer.showAudioAlbumTracksHolder({
            tracks: wpPlayer.tracks
        });
        wpPlayer.createPlayer();
        wpPlayer.initMainControls({
            playlists: wpPlayer.playlists
        });
    };
    wpPlayer.prevTrack = function(event) {
        var length = wpPlayer.playing_playlist.playlist.length;
        if (length) {
            if (wpPlayer.playing_playlist.playing >= 0) {
                var playing = wpPlayer.playing_playlist.playing - 1;
                if (playing == -1) {
                    playing = length - 1;
                }
                //
                var track_info = wpPlayer.playing_playlist.playlist[playing];
                var object_id = track_info['object_id'];
                var track_id = track_info['track_id'];
                var album_id = track_info['album_id'];
                var perfomer_name = track_info['perfomer_name'];
                var track_title = track_info['track_title'];
                var src = track_info['src'];
                var track_duration = track_info['track_duration'];

                var old_track_info = false;
                if (wpPlayer.second_controls_active) {//удалим старый controls
                    if ($('#' + wpPlayer.second_controls_active).length > 0) {
                        wpPlayer.removeSecondControls('#' + wpPlayer.second_controls_active)
                        //
                        old_track_info = JSON.parse($('#' + wpPlayer.second_controls_active).attr('data-info'));
                    }
                }
                wpPlayer.second_controls_active = 'mejs-container-' + track_id + '_' + album_id;

                wpPlayer.addSecondControls('#' + wpPlayer.second_controls_active);
                //
                $('#mejs-playlists-content>.mejs-playlists-playlist_tracks-itm.playing').removeClass('playing');
                $('#mejs-playlists-playlist_tracks-itm-' + object_id + '').addClass('playing');
                //
                wpPlayer.loadAndPlayTrack(perfomer_name, track_title, src, track_duration);

                wpPlayer.playing_playlist.playing = playing;
                //
                if (old_track_info) {
                    var old_track_id = old_track_info.track_id;
                    var old_track_album_id = old_track_info.album_id;
                    var old_track_duration = old_track_info.track_duration;
                    $('#mejs-container-' + old_track_id + '_' + old_track_album_id + ' .mejs-revcurrenttime').text(old_track_duration);
                }
            }
        }
    };
    wpPlayer.nextTrack = function(event, do_check_ended) {
        var do_check_ended = do_check_ended || false;
        var do_play = true;
        var length = wpPlayer.playing_playlist.playlist.length;
        if (length) {
            if (wpPlayer.playing_playlist.playing < length) {
                var playing = wpPlayer.playing_playlist.playing + 1;
                if (playing == length) {
                    playing = 0;
                    if (do_check_ended && !wpPlayer.isPlaylistRepeatPlay) {
                        do_play = false;
                    }
                }
                //
                var track_info = wpPlayer.playing_playlist.playlist[playing];
                var object_id = track_info['object_id'];
                var track_id = track_info['track_id'];
                var album_id = track_info['album_id'];
                var perfomer_name = track_info['perfomer_name'];
                var track_title = track_info['track_title'];
                var src = track_info['src'];
                var track_duration = track_info['track_duration'];

                var old_track_info = false;
                if (wpPlayer.second_controls_active) {//удалим старый controls
                    if ($('#' + wpPlayer.second_controls_active).length > 0) {
                        wpPlayer.removeSecondControls('#' + wpPlayer.second_controls_active)
                        //
                        old_track_info = JSON.parse($('#' + wpPlayer.second_controls_active).attr('data-info'));
                    }
                }
                wpPlayer.second_controls_active = 'mejs-container-' + track_id + '_' + album_id;

                wpPlayer.addSecondControls('#' + wpPlayer.second_controls_active);
                //
                $('#mejs-playlists-content>.mejs-playlists-playlist_tracks-itm.playing').removeClass('playing');
                $('#mejs-playlists-playlist_tracks-itm-' + object_id + '').addClass('playing');
                //
                if (do_play) {
                    wpPlayer.loadAndPlayTrack(perfomer_name, track_title, src, track_duration);
                }
                else {
                    wpPlayer.loadTrack(perfomer_name, track_title, src, track_duration);
                }
                wpPlayer.playing_playlist.playing = playing;
                //
                if (old_track_info) {
                    var old_track_id = old_track_info.track_id;
                    var old_track_album_id = old_track_info.album_id;
                    var old_track_duration = old_track_info.track_duration;
                    $('#mejs-container-' + old_track_id + '_' + old_track_album_id + ' .mejs-revcurrenttime').text(old_track_duration);
                }
            }
        }
    };
    wpPlayer.onPlay = function(e) {
        if (!wpPlayer.check_count_preview && wpPlayer.playing_playlist.playlist.length > 0) {
            wpPlayer.check_count_preview = true;
            var playing = wpPlayer.playing_playlist.playing;
            var track_info = wpPlayer.playing_playlist.playlist[playing];
            wpPlayer.addTrackPreview(track_info['track_id'], track_info['album_id'], wpPlayer.playing_playlist.id);
        }

    };
    wpPlayer.onEnded = function(e) {
        if (wpPlayer.playing_playlist.playlist.length > 0) {
            if (!t.options.loop) {
                setTimeout(function() {//без таймера не работает!!!!????
                    wpPlayer.nextTrack(e, true);
                }, 1000)
            }
        }

    };
    /**
     * Создаем MediaElementPlayer
     */
    wpPlayer.createPlayer = function() {
        if (!wpPlayer.is_ready_player) {
            $("#wp_player_tmpl").tmpl().appendTo('body');
            $('#wp-mediaelement').mediaelementplayer({enableKeyboard: true, features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen', 'additionalcontrols', 'loop']});
            wpPlayer.player = $('#wp-mediaelement')[0].player;
            wpPlayer.is_ready_player = true;
        }
    };
    /**
     * Инициализируем главную панель для управления плеером
     */
    wpPlayer.initMainControls = function(options) {
        if (!wpPlayer.main_controls_active) {
            if (wpPlayer.player.created) {
                $("#wp_player_main_controls_tmpl").tmpl().appendTo('body');

                wpPlayer.player.addControls('#wp_player_main_controls');

                $('#wp_player_main_controls .mejs-currenttime-container').bind('click', function() {
                    $(this).css({'display': 'none'});
                    $('#wp_player_main_controls .mejs-revcurrenttime-container').css({'display': 'block'});
                });
                $('#wp_player_main_controls .mejs-revcurrenttime-container').bind('click', function() {
                    $(this).css({'display': 'none'});
                    $('#wp_player_main_controls .mejs-currenttime-container').css({'display': 'block'});
                });
                $(wpPlayer.document)
                        .unbind('keydown.wp_player_main').bind('keydown.wp_player_main', function(event) {
                    if (!wpPlayer.player.hasFocus) {
                        return;
                    }
                    if (wpPlayer.isKeypress(event, 32)) {
                        if (!$.browser.mozilla) {
                            if ($('#mejs-playpause-button').is('.mejs-pause')) {
                                $('#mejs-playpause-button').addClass('mejs-play-press');
                            }
                            else {
                                $('#mejs-playpause-button').addClass('mejs-pause-press');
                            }
                        }
                        else {
                            if ($('#mejs-playpause-button').is('.mejs-play')) {
                                $('#mejs-playpause-button').addClass('mejs-play-press');
                            }
                            else {
                                $('#mejs-playpause-button').addClass('mejs-pause-press');
                            }
                        }
                    }
                })
                        .unbind('keyup.wp_player_main').bind('keyup.wp_player_main', function(event) {
                    if (!wpPlayer.player.hasFocus) {
                        return;
                    }
                    if (wpPlayer.isKeypress(event, 32)) {
                        if ($('#mejs-playpause-button').is('.mejs-play')) {
                            $('#mejs-playpause-button').removeClass('mejs-play-press');
                        }
                        else {
                            $('#mejs-playpause-button').removeClass('mejs-pause-press');
                        }
                    }
                });
                $('#wp_player_main_controls .mejs-button').each(function() {
                    if ($(this).is('.mejs-prev-button')) {
                        $(this)
                                .unbind('mousedown.wp_player_main').bind('mousedown.wp_player_main', function() {
                            $(this).addClass('mejs-prev-press');
                        })
                                .unbind('mouseup.wp_player_main').bind('mouseup.wp_player_main', function() {
                            $(this).removeClass('mejs-prev-press');
                        });
                    }
                    if ($(this).is('.mejs-playpause-button')) {
                        $(this)
                                .unbind('mousedown.wp_player_main').bind('mousedown.wp_player_main', function() {
                            if ($(this).is('.mejs-play')) {
                                $(this).addClass('mejs-play-press');
                            }
                            else {
                                $(this).addClass('mejs-pause-press');
                            }
                        })
                                .unbind('mouseup.wp_player_main').bind('mouseup.wp_player_main', function() {
                            if ($(this).is('.mejs-play')) {
                                $(this).removeClass('mejs-play-press');
                            }
                            else {
                                $(this).removeClass('mejs-pause-press');
                            }
                        });

                    }
                    if ($(this).is('.mejs-next-button')) {
                        $(this)
                                .unbind('mousedown.wp_player_main').bind('mousedown.wp_player_main', function() {
                            $(this).addClass('mejs-next-press');
                        })
                                .unbind('mouseup.wp_player_main').bind('mouseup.wp_player_main', function() {
                            $(this).removeClass('mejs-next-press');
                        });
                    }

                    if ($(this).is('.mejs-playlist-button')) {
                        if (wpUser.id) {
                            $(this)
                                    .unbind('mousedown.wp_player_main').bind('mousedown.wp_player_main', function() {
                                $(this).toggleClass('mejs-playlist-press');
                            })
                                    .unbind('mouseup.wp_player_main').bind('mouseup.wp_player_main', function() {
                                //$(this).removeClass('mejs-playlist-press');
                            });
                        }
                        else {
                            $(this).addClass('mejs-playlist-press');
                        }
                    }

                });

                var height = $('html').height();
                $("#wp_player_main_controls").css({'z-index': 998, position: 'fixed', left: 50, top: (height > 400 ? height - 100 : 0)}).draggable({cursor: "move", cancel: "button,input,.mejs-horizontal-volume-slider,.mejs-time-rail,.mejs-playlists-content", containment: "html"})
                wpPlayer.main_controls_active = 'wp_player_main_controls';

                wpPlayer.initCurrentPlaylist();
                wpPlayer.isMouseDownOnMainControls = false;
                $('#wp_player_main_controls')
                        .bind('mousedown', function() {
                            wpPlayer.isMouseDownOnMainControls = true;
                        })
                        .bind('mouseup', function() {
                            wpPlayer.isMouseDownOnMainControls = false;
                        })
                        .hover(
                                function() {
                                    if (!$(this).is('.mejs-open-playlist')) {
                                        var offset = $(this).offset();
                                        $(this).css({'left': offset.left - 33}).removeClass('mini');
                                        wpPlayer.player.additionalControls.setProgressRail();
                                        wpPlayer.player.additionalControls.setCurrentRail();

                                        wpPlayer.player.additionalControls.positionVolumeHandle(wpPlayer.player.media.volume);
                                    }
                                }, function() {
                            if (!wpPlayer.isMouseDownOnMainControls) {
                                if (!$(this).is('.mejs-open-playlist')) {
                                    var offset = $(this).offset();
                                    $(this).css({'left': offset.left + 33}).addClass('mini');
                                    wpPlayer.player.additionalControls.setProgressRail();
                                    wpPlayer.player.additionalControls.setCurrentRail();
                                }
                            }
                        }
                        );
                //
                wpPlayer.player.options.mainControlsHolderId = wpPlayer.main_controls_active;
                wpPlayer.player.options.callbacks.onNextTrack = wpPlayer.nextTrack;
                wpPlayer.player.options.callbacks.onPrevTrack = wpPlayer.prevTrack;
                wpPlayer.player.options.callbacks.onPlay = wpPlayer.onPlay;
                wpPlayer.player.options.callbacks.onEnded = wpPlayer.onEnded;
            }
            else {
                setTimeout(function() {
                    wpPlayer.initMainControls(options);
                }, 1000)
            }


        }
    }
    /**
     * Проиграем один трек
     * @param {string} perfomer_name
     * @param {string} track_title
     * @param {string} src
     * @param {string} track_duration
     */
    wpPlayer.playOneTrack = function(perfomer_name, track_title, src, track_duration) {
        wpPlayer.loadAndPlayTrack(perfomer_name, track_title, src, track_duration);
        wpPlayer.player.additionalControls.isPlaylistRepeatPlay = false;
        wpPlayer.deactivatePrevAndNextBtn();
        var id = Math.floor(Math.random( ) * (999999)).toString();
        var playlist = {
            playlist: [],
            active: 0,
            playing: 0,
            id: id,
            type: 'one'
        }

        wpPlayer.playing_playlist = playlist;

    };

    wpPlayer.signPlayOneTrack = function(event, perfomer_name, track_title, src, track_duration) {
        event.preventDefault();
        wpPlayer.playOneTrack(perfomer_name, track_title, src, track_duration);

    };

    wpPlayer.initCurrentPlaylist = function() {
        //
        if (wpPlayer.playlists.length == 0) {
            wpPlayer.deactivatePrevAndNextBtn();
            wpPlayer.showPlaylistDetail(null, false);
            //
            //$("#wp_player_main_controls").css({display: 'none'});
            wpPlayer.deactivatePlayBtn();
        }
        else {
            //разрешим повтор плейлиста
            wpPlayer.player.additionalControls.isPlaylistRepeatPlay = true;
            //
            wpPlayer.current_playlist = wpPlayer.playlists[0];
            wpPlayer.playing_playlist = wpPlayer.playlists[0];
            for (var i = 0; i < wpPlayer.playlists.length; i++) {
                if (wpPlayer.playlists[i].active) {
                    wpPlayer.current_playlist = wpPlayer.playlists[i];
                    wpPlayer.playing_playlist = wpPlayer.playlists[i];
                }
            }
            //
            wpPlayer.makeCurPlaylistAddBtnActive();
            //
            wpPlayer.playing_playlist.playing = 0
            //
            if (wpPlayer.playing_playlist.playlist.length > 0) {
                var
                        track_info = wpPlayer.playing_playlist.playlist[0]
                        , track_id = track_info.track_id
                        , album_id = track_info.album_id
                        , perfomer_name = track_info.perfomer_name
                        , track_title = track_info.track_title
                        , src = track_info.src
                        , track_duration = track_info.track_duration
                        ;

                wpPlayer.second_controls_active = 'mejs-container-' + track_id + '_' + album_id;

                wpPlayer.addSecondControls('#' + wpPlayer.second_controls_active);

                wpPlayer.loadTrack(perfomer_name, track_title, src, track_duration);
                //активируем кнопки prev и next    
                if (wpPlayer.playing_playlist.playlist.length > 1) {
                    wpPlayer.activatePrevAndNextBtn();
                }
                else {
                    wpPlayer.deactivatePrevAndNextBtn();
                }
            }

            wpPlayer.showPlaylistDetail(wpPlayer.current_playlist, false, {}, true);

        }
    };

    wpPlayer.setMainPlayerTitle = function(perfomer_name, track_title) {
        $('#wp_player_main_controls .mejs-title').html(perfomer_name + ' - ' + track_title);
    }
    /**
     * Инициализация кнопки плей
     * @param {number} track_id
     * @param {number} album_id
     * @param {string} perfomer_name
     * @param {string} track_title
     * @param {string} src
     * @param {string} track_duration
     */
    wpPlayer.playBtnInitSecondControls = function(track_id, album_id, perfomer_name, track_title, src, track_duration) {
        if (wpPlayer.second_controls_active != 'mejs-container-' + track_id + '_' + album_id) {
            setTimeout(function() {//не работает без таймера
                wpPlayer.initSecondControls(track_id, album_id, perfomer_name, track_title, src, track_duration);
            }, 0);
        }
    };
    /**
     * Инициализруем вторую панель для управления плеером
     * @param {number} track_id
     * @param {number} album_id
     * @param {string} perfomer_name
     * @param {string} track_title
     * @param {string} src
     * @param {string} track_duration
     */
    wpPlayer.initSecondControls = function(track_id, album_id, perfomer_name, track_title, src, track_duration) {

        if (wpPlayer.player.created) {
            if (wpPlayer.second_controls_active != 'mejs-container-' + track_id + '_' + album_id) {
                var old_track_info = false;
                if (wpPlayer.second_controls_active) {//удалим старый controls
                    if ($('#' + wpPlayer.second_controls_active).length) {
                        wpPlayer.removeSecondControls('#' + wpPlayer.second_controls_active)
                        //
                        old_track_info = JSON.parse($('#' + wpPlayer.second_controls_active).attr('data-info'));
                    }
                }
                wpPlayer.second_controls_active = 'mejs-container-' + track_id + '_' + album_id;
                //
                var $playing_playlist = $('#' + wpPlayer.second_controls_active).parent();
                if (!$playing_playlist.is('.mejs-playing-playlist')) {
                    wpPlayer.createPlayingPlaylistFromLst($playing_playlist[0]);
                }
                //
                wpPlayer.setPlayingTrack(track_id);
                //
                wpPlayer.addSecondControls('#' + wpPlayer.second_controls_active);

                wpPlayer.loadAndPlayTrack(perfomer_name, track_title, src, track_duration);

                //удалим класс активного трека в плейлисте
                $('#mejs-playlists-content>.mejs-playlists-playlist_tracks-itm.playing').removeClass('playing');
                //
                if (old_track_info) {
                    var old_track_id = old_track_info.track_id;
                    var old_track_album_id = old_track_info.album_id;
                    var old_track_duration = old_track_info.track_duration;
                    $('#mejs-container-' + old_track_id + '_' + old_track_album_id + ' .mejs-revcurrenttime').text(old_track_duration);
                }
            }
        }
        else {
            setTimeout(function() {
                wpPlayer.initSecondControls(track_id, album_id, perfomer_name, track_title, src, track_duration);
            }, 1000)
        }
    };

    wpPlayer.initSecondControlsActive = function() {
        if (wpPlayer.second_controls_active != '') {
            if ($('#' + wpPlayer.second_controls_active).length) {
                //без удаления возникает зависание!!!!????
                wpPlayer.removeSecondControls('#' + wpPlayer.second_controls_active);

                wpPlayer.addSecondControls('#' + wpPlayer.second_controls_active);
            }
        }

    };

    wpPlayer.addSecondControls = function(selector) {
        $(selector).addClass('mejs-active');

        wpPlayer.document.unbind('mouseup.wp_player_second_controls');

        var secondControlsTimeHandleIsLight = false;
        var mouseIsDownSecondControlsTimeHandle = false;
        var timerForSecondControlsTimeHandle = '';
        var $secondControlsTimeHandleActive = '';

        wpPlayer.document
                .bind('mouseup.wp_player_second_controls', function() {
                    mouseIsDownSecondControlsTimeHandle = false;
                    clearTimeout(timerForSecondControlsTimeHandle);
                    if (secondControlsTimeHandleIsLight) {
                        $secondControlsTimeHandleActive.animate({'opacity': '1'}, 700);
                        secondControlsTimeHandleIsLight = false;
                    }
                })
        $(selector + ' .mejs-time-rail')
                .unbind('mousedown.wp_player_second_controls').bind('mousedown.wp_player_second_controls', function() {
            mouseIsDownSecondControlsTimeHandle = true;
            $secondControlsTimeHandleActive = $(this).find('.mejs-time-handle');

            if (!secondControlsTimeHandleIsLight) {
                setTimeout(function() {
                    if (mouseIsDownSecondControlsTimeHandle) {
                        $secondControlsTimeHandleActive.animate({'opacity': '0.5'}, 500);
                        secondControlsTimeHandleIsLight = true;
                    }
                }, 200);
            }
        });

        var secondControlsVolumeHandleIsLight = false;
        var mouseIsDownSecondControlsVolumeHandle = false;
        var timerForSecondControlsVolumeHandle = '';
        var $secondControlsVolumeHandleActive = '';

        wpPlayer.document
                .bind('mouseup.wp_player_second_controls', function() {
                    mouseIsDownSecondControlsVolumeHandle = false;
                    clearTimeout(timerForSecondControlsVolumeHandle);
                    if (secondControlsVolumeHandleIsLight) {
                        $secondControlsVolumeHandleActive.animate({'opacity': '1'}, 700);
                        secondControlsVolumeHandleIsLight = false;
                    }
                })
        $(selector + ' .mejs-horizontal-volume-slider')
                .unbind('mousedown.wp_player_second_controls').bind('mousedown.wp_player_second_controls', function() {
            mouseIsDownSecondControlsVolumeHandle = true;
            $secondControlsVolumeHandleActive = $(this).find('.mejs-horizontal-volume-handle');

            if (!secondControlsVolumeHandleIsLight) {
                setTimeout(function() {
                    if (mouseIsDownSecondControlsVolumeHandle) {
                        $secondControlsVolumeHandleActive.animate({'opacity': '0.5'}, 500);
                        secondControlsVolumeHandleIsLight = true;
                    }
                }, 200);
            }
        });
        //вызывается когда элемент mejs-horizontal-volume-slider будет видимым. Иначе вызов wpPlayer.player.additionalControls.positionVolumeHandle спрячет его
        wpPlayer.player.addControls('#' + wpPlayer.second_controls_active);
        //покажем играет ли с плейлиста
        if (wpPlayer.do_controls_class_is_type) {
            if (wpPlayer.playing_playlist.type == 'native') {
                $('#' + wpPlayer.second_controls_active).removeClass('mejs-is_container').addClass('mejs-is_native');
            } else
            if (wpPlayer.playing_playlist.type == 'container') {
                $('#' + wpPlayer.second_controls_active).removeClass('mejs-is_native').addClass('mejs-is_container');
            }
        }

    };

    wpPlayer.removeSecondControls = function(selector) {
        wpPlayer.player.removeControls(selector);
        $(selector).removeClass('mejs-active').removeClass('mejs-is_native').removeClass('mejs-is_container');
        if (wpPlayer.do_controls_class_is_type) {
            $(selector).removeClass('mejs-is_native').removeClass('mejs-is_container');
        }
    };

    wpPlayer.loadAndPlayTrack = function(perfomer_name, track_title, src, track_duration) {
        wpPlayer.loadTrack(perfomer_name, track_title, src, track_duration);
        wpPlayer.player.play();
    };

    wpPlayer.loadTrack = function(perfomer_name, track_title, src, track_duration) {
        wpPlayer.activatePlayBtn();
        wpPlayer.setMainPlayerTitle(perfomer_name, track_title);
        wpPlayer.player.setDuration(track_duration);

        var srcMp3 = src;
        var srcOgg = src.replace('/mp3/', '/ogg/').replace('.mp3', '.ogg');

        wpPlayer.player.pause();
        /**
         * фикс для хрома - ogg формат нужно указать первым
         */
        wpPlayer.player.setSrc([{src: srcOgg, type: 'audio/ogg'}, {src: srcMp3, type: 'audio/mp3'}]);
        wpPlayer.player.load();
        wpPlayer.check_count_preview = false;
    };
    /**
     * Создадим плейлист из контейнера
     * @param {string} elem
     */
    wpPlayer.createPlayingPlaylistFromLst = function(elem) {
        //запретим повтор плейлиста
        wpPlayer.player.additionalControls.isPlaylistRepeatPlay = false;
        //
        if (!wpPlayer.create_for_all_track) {
            elem = elem || '';
            if (typeof elem == 'string' && elem != '') {
                elem = document.getElementById(elem);
            }
            var playlist = $(elem).addClass('mejs-playing-playlist').children('li').map(function(index) {
                var track_info = JSON.parse($(this).attr('data-info'));
                return track_info;
            }).get();
        }
        else {
            var playlist = $('ul.mejs-container-lst').addClass('mejs-playing-playlist').children('div,li').map(function(index) {
                var track_info = JSON.parse($(this).attr('data-info'));
                return track_info;
            }).get();
        }
        var id = Math.floor(Math.random( ) * (999999)).toString();
        wpPlayer.playing_playlist = {
            playlist: playlist,
            active: 0,
            playing: 0,
            id: id,
            type: 'container'
        };
        //активируем кнопки prev и next    
        if (wpPlayer.playing_playlist.playlist.length > 1) {
            wpPlayer.activatePrevAndNextBtn();
        }
        else {
            wpPlayer.deactivatePrevAndNextBtn();
        }
        console.log(wpPlayer.playing_playlist.playlist);
        //
        //$("#wp_player_main_controls").css({display: 'block'});
        wpPlayer.activatePlayBtn();
    };

    wpPlayer.extendPlayingPlaylistFromLstActive = function(playlist_extension) {
        var playlist_extension = playlist_extension || [];
        if (wpPlayer.second_controls_active) {
            if (wpPlayer.playing_playlist.type == 'container') {
                $.merge(wpPlayer.playing_playlist.playlist, playlist_extension);
            }
            //активируем кнопки prev и next
            if (wpPlayer.playing_playlist.playlist.length > 1) {
                wpPlayer.activatePrevAndNextBtn();
            }
            else {
                wpPlayer.deactivatePrevAndNextBtn();
            }
        }
    };

    wpPlayer.initPlayingPlaylistFromLstActive = function() {
        if (wpPlayer.second_controls_active) {
            if (wpPlayer.playing_playlist.type == 'container') {
                var track_id = wpPlayer.getPlayingTrack();
                //
                var $playing_playlist = $('#' + wpPlayer.second_controls_active).parent();
                if ($playing_playlist.length && !$playing_playlist.is('.mejs-playing-playlist')) {
                    wpPlayer.createPlayingPlaylistFromLst($playing_playlist[0]);
                }
                //
                wpPlayer.setPlayingTrack(track_id);
                //активируем кнопки prev и next
                if (wpPlayer.playing_playlist.playlist.length > 1) {
                    wpPlayer.activatePrevAndNextBtn();
                }
                else {
                    wpPlayer.deactivatePrevAndNextBtn();
                }
            }
        }
    };

    wpPlayer.deletePlayingPlaylistClassPlaying = function() {
        if (!wpPlayer.create_for_all_track) {
            if (wpPlayer.second_controls_active) {
                var $playing_playlist = $('#' + wpPlayer.second_controls_active).parent();
                if ($playing_playlist.is('.mejs-playing-playlist')) {
                    $playing_playlist.removeClass('mejs-playing-playlist');
                }
            }
        }
        else {
            $('ul.mejs-container-lst').removeClass('mejs-playing-playlist');
        }

    };

    wpPlayer.showPlaylistDetail = function(playlist_info, check_edit, opens, do_class_playing) {
        var
                check_edit = check_edit || false
                , opens = opens || {}
        , do_class_playing = do_class_playing || false
                ;
        if (playlist_info) {
            var
                    playlist_id = playlist_info.id
                    , playlist_title = playlist_info.title
                    , user_id = playlist_info.user_id
                    , my_id = playlist_info.my_id
                    , community_id = playlist_info.community_id
                    , playlist = playlist_info.playlist
                    , playing = playlist_info.playing
                    , type = playlist_info.type
                    ;
        }
        else {
            var
                    playlist_id = 0
                    , playlist_title = 'Новый плейлист'
                    , user_id = 0
                    , my_id = 0
                    , community_id = 0
                    , playlist = []
                    , playing = 0
                    , type = ''
                    ;
        }
        if (!check_edit) {
            var options = [];

            if (wpPlayer.playlists.length > 0) {
                for (var i = 0; i < wpPlayer.playlists.length; i++) {
                    var selected = '';
                    if (wpPlayer.playlists[i].id == playlist_id) {
                        selected = 'selected="selected"';
                    }
                    options.push({value: wpPlayer.playlists[i].id, caption: wpPlayer.playlists[i].title, selected: selected});
                }
            } else {
                options.push({value: '0', caption: '--', selected: 'selected="selected"'});
            }

            var selected = '';
            if (type == 'favorite_tracks') {
                selected = 'selected="selected"';
            }
            options.push({value: 'favorite_tracks', caption: 'Любимые треки', selected: selected});
            var selected = '';
            if (type == 'last_tracks') {
                selected = 'selected="selected"';
            }
            options.push({value: 'last_tracks', caption: 'Последние треки', selected: selected});
        }


        $('#mejs-playlists-cnt').empty();
        $("#playlist")
                .tmpl({
                    options: options
                    , playlist_id: playlist_id
                    , playlist_title: playlist_title
                    , type: type
                    , user_id: user_id
                    , my_id: my_id
                    , playlist: playlist
                    , check_edit: check_edit
                    , do_class_playing: do_class_playing
                    , playing: playing
                })
                .appendTo('#mejs-playlists-cnt');

        if (!check_edit) {
            $("#mejs-playlists-playlist_title-sel").bind('change', function(event) {
                var playlist_id = $(this).val();
                if (playlist_id == 'favorite_tracks' || playlist_id == 'last_tracks' || parseInt(playlist_id) > 0) {
                    wpPlayer.setPlayingPlaylist(playlist_id);
                } else {
                    wpPlayer.showPlaylistDetail(null, false);
                }
            });
            wpPlayer.cuselect('#mejs-playlists-playlist_title-sel');
            wpPlayer.cumenu('#mejs-playlists-playlist_edit');
        }
        else {
            $('#playlist_title_edit' + playlist_id).bind('blur', function() {
                var value = $(this).val();

                if (value == '') {
                    $(this).val(playlist_title)
                }
            });
            if (playlist.length > 1) {
                $('#mejs-playlists-content').sortable({cancel: 'a.mejs-playlists-playlist_tracks-delete', cursor: 'move'});
            }
        }
        if (playlist_id) {
            if (!check_edit) {
                $('#mejs-playlists-playlist_edit-lnk-' + playlist_id).bind('click', function(event) {
                    do_class_playing = false;
                    if (wpPlayer.current_playlist == wpPlayer.playing_playlist) {
                        do_class_playing = true;
                    }
                    wpPlayer.showPlaylistDetail(wpPlayer.current_playlist, true, {}, do_class_playing);
                });
                $('#mejs-playlists-playlist_add-lnk-' + playlist_id).bind('click', function(event) {
                    wpPlayer.showPlaylistDetail(null, false);
                });
                $('#mejs-playlists-playlist_delete-lnk-' + playlist_id).bind('click', function(event) {
                    var
                            playlist_id = this.id.substring(this.id.lastIndexOf('-') + 1)
                            ;
                    wpPlayer.deletePlaylist(playlist_id);
                });
                $('#mejs-playlists-playlist_shuffle-lnk-' + playlist_id).bind('click', function(event) {
                    wpPlayer.shuffle(wpPlayer.current_playlist.playlist);
                    do_class_playing = false;
                    if (wpPlayer.current_playlist == wpPlayer.playing_playlist) {
                        do_class_playing = true;
                    }
                    wpPlayer.showPlaylistDetail(wpPlayer.current_playlist, false, {}, do_class_playing);
                });
            }
            else {
                $('#edit_playlist-' + playlist_id).bind('click', function(event) {
                    event.preventDefault();
                    var
                            playlist_id = this.id.substring(this.id.lastIndexOf('-') + 1)
                            , playlist_title = $('#playlist_title_edit-' + playlist_id).val()/** нужно для проверки входных данных */
                            , query_string_part = wpPlayer.serialize('mejs-playlists-playlist_edit-form')
                            ;
                    wpPlayer.editPlaylist(playlist_id, playlist_title, query_string_part);

                });
            }

        }
        if (playlist_id != 0) {
            if (playlist.length > 0) {
                for (var i = 0; i < playlist.length; i++) {
                    var
                            object_id = playlist[i].object_id
                            ;
                    if (check_edit) {
                        $('#mejs-playlists-playlist_tracks-delete-lnk-' + object_id).bind('click', function(event) {
                            wpPlayer.deleteTrackOfPlaylist(object_id, playlist_id, 0);
                        });
                    }
                    $('#mejs-playlists-playlist_tracks-itm-' + object_id).bind('click', function(event) {
                        //
                        wpPlayer.activatePrevAndNextBtn();
                        if (wpPlayer.playing_playlist.id != wpPlayer.current_playlist.id) {
                            //если играющий плейлист был из контейнера, тогда удалим класс активности
                            wpPlayer.deletePlayingPlaylistClassPlaying();
                            //
                            wpPlayer.playing_playlist = wpPlayer.current_playlist;
                            //разрешим повтор плейлиста
                            wpPlayer.player.additionalControls.isPlaylistRepeatPlay = true;
                            //активируем кнопки prev и next
                            if (wpPlayer.playing_playlist.playlist.length > 1) {
                                wpPlayer.activatePrevAndNextBtn();
                            }
                            else {
                                wpPlayer.deactivatePrevAndNextBtn();
                            }
                        }


                        //
                        var
                                object_id = this.id.substring(this.id.lastIndexOf('-') + 1)
                                ;

                        var playlist = wpPlayer.playing_playlist['playlist'];

                        var playing = 0;
                        for (var i = 0; i < playlist.length; i++) {
                            if (playlist[i]['object_id'] == object_id) {
                                playing = i;
                                break;
                            }
                        }
                        wpPlayer.playing_playlist['playing'] = playing;
                        var
                                track_info = wpPlayer.playing_playlist.playlist[playing]
                                , track_id = track_info.track_id
                                , album_id = track_info.album_id
                                , perfomer_name = track_info.perfomer_name
                                , track_title = track_info.track_title
                                , src = track_info.src
                                , track_duration = track_info.track_duration
                                ;

                        var old_track_info = false;
                        if (wpPlayer.second_controls_active) {//удалим старый controls
                            if ($('#' + wpPlayer.second_controls_active).length > 0) {
                                wpPlayer.removeSecondControls('#' + wpPlayer.second_controls_active);
                                //
                                old_track_info = JSON.parse($('#' + wpPlayer.second_controls_active).attr('data-info'));
                            }
                        }
                        wpPlayer.second_controls_active = 'mejs-container-' + track_id + '_' + album_id;

                        wpPlayer.addSecondControls('#' + wpPlayer.second_controls_active);

                        wpPlayer.loadAndPlayTrack(perfomer_name, track_title, src, track_duration);
                        //
                        $('#mejs-playlists-content>.mejs-playlists-playlist_tracks-itm.playing').removeClass('playing');
                        $('#mejs-playlists-playlist_tracks-itm-' + object_id + '').addClass('playing');
                        //
                        if (old_track_info) {
                            var old_track_id = old_track_info.track_id;
                            var old_track_album_id = old_track_info.album_id;
                            var old_track_duration = old_track_info.track_duration;
                            $('#mejs-container-' + old_track_id + '_' + old_track_album_id + ' .mejs-revcurrenttime').text(old_track_duration);
                        }
                    });
                }
            }
        }
        else {
            $('#playlist_title').bind('focus', function(event) {
                var value = $(this).val();

                if (value == 'Введите название плейлиста') {
                    $(this).val('')
                }
            });
            $('#playlist_title').bind('blur', function(event) {
                var value = $(this).val();

                if (value == '') {
                    $(this).val('Введите название плейлиста')
                }
            });
            $('#add_playlist').bind('click', function(event) {
                event.preventDefault();
                var
                        playlist_title = $('#playlist_title').val()
                        ;
                wpPlayer.addPlaylist(playlist_title);
            });
            $('#cancel_playlist').bind('click', function(event) {
                event.preventDefault();
                if (wpPlayer.playlists.length > 0) {
                    do_class_playing = false;
                    if (wpPlayer.current_playlist == wpPlayer.playing_playlist) {
                        do_class_playing = true;
                    }
                    wpPlayer.showPlaylistDetail(wpPlayer.current_playlist, false, {}, do_class_playing);
                }
                else {
                    wpPlayer.showPlaylistDetail(null, false);
                }
            });
            $('#add_playlist,#cancel_playlist').bind('mousedown', function() {
                $(this).addClass('press');
            });
            $('#add_playlist,#cancel_playlist').bind('mouseup', function() {
                $(this).removeClass('press');
            });
        }
    };

    wpPlayer.setPlayingPlaylist = function(playlist_id, community_id) {
        //если играющий плейлист был из контейнера, тогда удалим класс активности
        wpPlayer.deletePlayingPlaylistClassPlaying();
        //удалим класс у активных кнопок добавленные
        wpPlayer.removeCurPlaylistAddBtnActive();
        //                        
        if (playlist_id == 'favorite_tracks') {
            wpPlayer.getFavoriteTracks();
        } else
        if (playlist_id == 'last_tracks') {
            wpPlayer.getLastTracks();
        }
        else {
            for (var i = 0; i < wpPlayer.playlists.length; i++) {
                if (wpPlayer.playlists[i].id == playlist_id) {
                    //вызывается до назначения текушего плейлиста!
                    wpPlayer.makePlaylistIsActive(playlist_id);
                    //
                    wpPlayer.current_playlist = wpPlayer.playlists[i];
                    wpPlayer.playing_playlist = wpPlayer.playlists[i];
                    //
                    wpPlayer.playing_playlist.playing = 0;
                    //
                    wpPlayer.makeCurPlaylistAddBtnActive();
                    break;
                }
            }
        }

        //разрешим повтор плейлиста
        wpPlayer.player.additionalControls.isPlaylistRepeatPlay = true;
        //
        var old_track_info = false;
        if (wpPlayer.second_controls_active) {//удалим старый controls
            if ($('#' + wpPlayer.second_controls_active).length > 0) {
                wpPlayer.removeSecondControls('#' + wpPlayer.second_controls_active);
                //
                old_track_info = JSON.parse($('#' + wpPlayer.second_controls_active).attr('data-info'));
            }
        }
        if (wpPlayer.playing_playlist.playlist.length > 0) {
            var
                    track_info = wpPlayer.playing_playlist.playlist[0]
                    , track_id = track_info.track_id
                    , album_id = track_info.album_id
                    , perfomer_name = track_info.perfomer_name
                    , track_title = track_info.track_title
                    , src = track_info.src
                    , track_duration = track_info.track_duration
                    ;

            wpPlayer.second_controls_active = 'mejs-container-' + track_id + '_' + album_id;

            wpPlayer.addSecondControls('#' + wpPlayer.second_controls_active);

            wpPlayer.loadAndPlayTrack(perfomer_name, track_title, src, track_duration);

            //активируем кнопки prev и next
            if (wpPlayer.playing_playlist.playlist.length > 1) {
                wpPlayer.activatePrevAndNextBtn();
            }
            else {
                wpPlayer.deactivatePrevAndNextBtn();
            }
        }
        else {
            wpPlayer.second_controls_active = '';
            wpPlayer.loadTrack('', '', '/files/music/audios/default.mp3', '00:00')
        }
        //
        if (old_track_info) {
            var old_track_id = old_track_info.track_id;
            var old_track_album_id = old_track_info.album_id;
            var old_track_duration = old_track_info.track_duration;
            $('#mejs-container-' + old_track_id + '_' + old_track_album_id + ' .mejs-revcurrenttime').text(old_track_duration);
        }

        do_class_playing = false;
        if (wpPlayer.current_playlist == wpPlayer.playing_playlist) {
            do_class_playing = true;
        }

        wpPlayer.showPlaylistDetail(wpPlayer.current_playlist, false, {}, do_class_playing);
        //
        if (community_id) {
            $('#music-community-tracks-select_playlist_id').val(playlist_id);
            $('#music-community-tracks-select_playlist_id-btn').click();
        }
    };
    /**
     * Добавить трек в плейлист
     * @param {number} track_id
     * @param {number} album_id
     * @param {number} playlist_id
     */
    wpPlayer.addTrackInPlaylist = function(track_id, album_id, playlist_id) {
        if (!wpUser.id) {
            errorMessage("Добавлять трек в плейлист могут только авторизованные пользователи.");
            return;
        }
        if (wpPlayer.ajax_active) {
            return;
        }
        wpPlayer.ajax_active = true;
        var error = '';
        var moderate_date = new Date().getTime();
        var perfomer_id = 0;
        var community_id = 0;
        var set_query_string_part = '';

        if (playlist_id) {
            if (set_query_string_part) {
                set_query_string_part += '&';
            }
            set_query_string_part = 'playlist_id=' + playlist_id;
            if (wpPlayer.current_playlist.type != 'native') {
                error += 'В этот плейлист нельзя добавить трек.';
            }
            //произведем необходимы действия над нашим плейлистом
            if (wpPlayer.playlists.length) {
                for (var i = 0; i < wpPlayer.playlists.length; i++) {
                    if (wpPlayer.playlists[i]['id'] == playlist_id) {
                        perfomer_id = wpPlayer.playlists[i]['perfomer_id'];
                        community_id = wpPlayer.playlists[i]['community_id'];
                        if (wpPlayer.playlists[i]['moderate_date']) {
                            moderate_date = wpPlayer.playlists[i]['moderate_date'];
                        }
                        else {
                            wpPlayer.playlists[i]['moderate_date'] = moderate_date;
                        }
                        //проверим был ли добавлен трек
                        for (var j = 0; j < wpPlayer.playlists[i].playlist.length; j++) {
                            if (wpPlayer.playlists[i].playlist[j]['track_id'] == track_id) {
                                error += 'Этот трек уже был добавлен в текущий плейлист.';
                            }
                        }
                    }
                }
            }
        }
        if (error) {
            errorMessage(error);
            wpPlayer.ajax_active = false;
            return;
        }
        var xhr = $.ajax({
            url: base_url + '/playlist/track/' + track_id,
            data: set_query_string_part,
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                var
                        playlist_id = data.playlist_id
                        , track_info = data.track_info
                        , track_id = track_info.track_id
                        , album_id = track_info.album_id
                        , playlist_is_created = data.playlist_is_created
                        ;

                //
                $('#mejs-add-button-btn-' + track_id + '_' + album_id + '').parent().addClass('mejs-added');
                //если был создан первый плейлист
                if (playlist_is_created) {
                    // удалим не нужную опцию
                    wpPlayer.removeSelectOption(0);

                    var new_playlist = {
                        playlist: [],
                        active: 0,
                        playing: 0,
                        id: playlist_id,
                        title: 'Мой плейлист',
                        type: 'native'
                    };
                    wpPlayer.playlists.push(new_playlist);
                    if (wpPlayer.playlists.length == 1) {
                        wpPlayer.current_playlist = new_playlist;
                        if (wpPlayer.playing_playlist.id == 0) {//если не один плейлист не является играющим
                            wpPlayer.playing_playlist = new_playlist;
                            //разрешим повтор плейлиста
                            wpPlayer.player.additionalControls.isPlaylistRepeatPlay = true;
                        }
                        //
                        //$("#wp_player_main_controls").css({display: 'block'});
                        wpPlayer.activatePlayBtn();
                    }
                }
                //добавим трек в плейлист
                for (var i = 0; i < wpPlayer.playlists.length; i++) {
                    if (wpPlayer.playlists[i]['id'] == playlist_id) {
                        wpPlayer.playlists[i].playlist.push(track_info);
                    }
                }
                //если наш плейлист является текущим
                if (wpPlayer.current_playlist.id == playlist_id) {
                    //если текущий плейлист является играющим 
                    if (wpPlayer.current_playlist.id == wpPlayer.playing_playlist.id) {
                        //если добавился только первый трек
                        if (wpPlayer.playing_playlist.playlist.length == 1) {
                            var
                                    track_info = wpPlayer.playing_playlist.playlist[0]
                                    , track_id = track_info.track_id
                                    , album_id = track_info.album_id
                                    , perfomer_name = track_info.perfomer_name
                                    , track_title = track_info.track_title
                                    , src = track_info.src
                                    , track_duration = track_info.track_duration
                                    ;

                            if (wpPlayer.second_controls_active) {//удалим старый controls
                                if ($('#' + wpPlayer.second_controls_active).length) {
                                    wpPlayer.removeSecondControls('#' + wpPlayer.second_controls_active)
                                }
                            }

                            wpPlayer.second_controls_active = 'mejs-container-' + track_id + '_' + album_id;

                            wpPlayer.addSecondControls('#' + wpPlayer.second_controls_active);

                            if (!wpPlayer.player.media.paused) {
                                wpPlayer.loadAndPlayTrack(perfomer_name, track_title, src, track_duration);
                            }
                            else {
                                wpPlayer.loadTrack(perfomer_name, track_title, src, track_duration);
                            }

                        }

                        //активируем кнопки prev и next    
                        if (wpPlayer.playing_playlist.playlist.length > 1) {
                            wpPlayer.activatePrevAndNextBtn();
                        }
                    }

                    //
                    var do_class_playing = false;
                    //если текущий плейлист является играющим 
                    if (wpPlayer.current_playlist == wpPlayer.playing_playlist) {
                        do_class_playing = true;
                    }
                    wpPlayer.showPlaylistDetail(wpPlayer.current_playlist, false, {}, do_class_playing);

                }
                wpPlayer.ajax_active = false;
            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
                wpPlayer.ajax_active = false;
            }
        })
    };

    wpPlayer.deleteTrackOfPlaylist = function(track_id, playlist_id, is_delete_from_page) {
        if (wpPlayer.ajax_active) {
            return;
        }
        wpPlayer.ajax_active = true;
        is_delete_from_page = is_delete_from_page || false;

        $.ajax({
            url: base_url + '/playlist/track/' + track_id,
            type: 'DELETE',
            data: 'playlist_id=' + playlist_id,
            dataType: 'json',
            success: function(data) {
                if (wpPlayer.playlists.length) {
                    //удалим трек из плейлиста
                    var old_track_id = 0;
                    var old_album_id = 0;
                    var old_track_is_playing = false;
                    for (var i in wpPlayer.playlists) {
                        if (wpPlayer.playlists[i].id == playlist_id) {
                            var temp = [];
                            for (var j = 0; j < wpPlayer.playlists[i].playlist.length; j++) {
                                if (wpPlayer.playlists[i].playlist[j].track_id == track_id) {
                                    old_track_id = wpPlayer.playlists[i].playlist[j].track_id;
                                    old_album_id = wpPlayer.playlists[i].playlist[j].album_id;
                                    if (wpPlayer.playing_playlist.playing == j) {
                                        old_track_is_playing = true;
                                    }
                                }
                                else {
                                    temp.push(wpPlayer.playlists[i].playlist[j]);
                                }
                            }
                            wpPlayer.playlists[i].playlist = temp;
                            break;
                        }
                    }
                    //удалим трек из страницы
                    if (is_delete_from_page) {
                        $('#mejs-container-' + old_track_id + '_' + old_album_id).remove();
                    }
                    //если наш плейлист является текущим
                    if (wpPlayer.current_playlist.id == playlist_id) {
                        if (wpPlayer.current_playlist.id == wpPlayer.playing_playlist.id) {

                            $('#mejs-add-button-btn-' + old_track_id + '_' + old_album_id + '').parent().removeClass('mejs-added');

                            //деактивируем кнопки prev и next
                            if (wpPlayer.playing_playlist.playlist.length <= 1) {
                                wpPlayer.deactivatePrevAndNextBtn();
                            }
                        }

                        var do_class_playing = false;
                        //если текущий плейлист является играющим
                        if (wpPlayer.current_playlist == wpPlayer.playing_playlist) {
                            do_class_playing = true;
                        }

                    }
                    //если наш плейлист является играющим
                    if (wpPlayer.playing_playlist.id == playlist_id) {
                        if (!old_track_is_playing) {
                            var playing = wpPlayer.playing_playlist.playing;
                            for (var i = 0; i < wpPlayer.playing_playlist.playlist.length; i++) {
                                if (wpPlayer.playing_playlist.playlist[playing].track_id == wpPlayer.playing_playlist.playlist[i].track_id) {
                                    wpPlayer.playing_playlist.playing = i;
                                }
                            }
                        }
                        else {
                            do_class_playing = false;
                            var playing = wpPlayer.playing_playlist.playing;
                            if (playing > 0) {
                                wpPlayer.playing_playlist.playing = playing - 1;
                            }
                        }
                    }
                    //если наш плейлист является текущим
                    if (wpPlayer.current_playlist.id == playlist_id) {
                        wpPlayer.showPlaylistDetail(wpPlayer.current_playlist, true, {}, do_class_playing);
                    }

                }
                wpPlayer.ajax_active = false;

            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
                wpPlayer.ajax_active = false;
            }

        });
    };

    wpPlayer.showNewPlaylist = function(playlist_id, playlist_title, user_id, my_id, perfomer_id, community_id) {
        var new_playlist = {
            playlist: [],
            active: 0,
            playing: 0,
            id: playlist_id,
            title: playlist_title,
            user_id: user_id,
            my_id: my_id,
            perfomer_id: perfomer_id,
            community_id: community_id,
            type: 'native'
        };
        wpPlayer.playlists.push(new_playlist);

        //
        wpPlayer.removeCurPlaylistAddBtnActive();

        wpPlayer.current_playlist = new_playlist;
        wpPlayer.playing_playlist = new_playlist;

        //
        wpPlayer.makeCurPlaylistAddBtnActive();

        //разрешим повтор плейлиста
        wpPlayer.player.additionalControls.isPlaylistRepeatPlay = true;
        //деактивируем кнопки prev и next    
        wpPlayer.deactivatePrevAndNextBtn();

        wpPlayer.showPlaylistDetail(wpPlayer.current_playlist);
    };

    wpPlayer.showAfterDeletePlaylistlPage = function(playlist_id) {
        if (wpPlayer.playlists.length) {
            var temp = [];
            for (var i = 0; i < wpPlayer.playlists.length; i++) {
                if (wpPlayer.playlists[i]['id'] != playlist_id) {
                    temp.push(wpPlayer.playlists[i]);
                }
                else {
                    wpPlayer.removeCurPlaylistAddBtnActive();
                }
            }
            wpPlayer.playlists = temp;
        }
        if (wpPlayer.playlists.length) {
            wpPlayer.current_playlist = wpPlayer.playlists[0];

            //
            wpPlayer.makeCurPlaylistAddBtnActive();
            //
            if (wpPlayer.playing_playlist.type == 'native') {
                wpPlayer.playing_playlist = wpPlayer.current_playlist;
                wpPlayer.playing_playlist.playing = 0;

                var old_track_info = false;
                if (wpPlayer.second_controls_active) {//удалим старый controls
                    if ($('#' + wpPlayer.second_controls_active).length > 0) {
                        wpPlayer.removeSecondControls('#' + wpPlayer.second_controls_active);
                        //
                        old_track_info = JSON.parse($('#' + wpPlayer.second_controls_active).attr('data-info'));
                    }
                }
                if (wpPlayer.playing_playlist.playlist.length > 0) {
                    var
                            track_info = wpPlayer.playing_playlist.playlist[0]
                            , track_id = track_info.track_id
                            , album_id = track_info.album_id
                            , perfomer_name = track_info.perfomer_name
                            , track_title = track_info.track_title
                            , src = track_info.src
                            , track_duration = track_info.track_duration
                            ;

                    wpPlayer.second_controls_active = 'mejs-container-' + track_id + '_' + album_id;

                    wpPlayer.addSecondControls('#' + wpPlayer.second_controls_active);
                    if (!wpPlayer.player.media.paused) {
                        wpPlayer.loadAndPlayTrack(perfomer_name, track_title, src, track_duration);
                    }
                    else {
                        wpPlayer.loadTrack(perfomer_name, track_title, src, track_duration);
                    }
                    //активируем кнопки prev и next    
                    if (wpPlayer.playing_playlist.playlist.length > 1) {
                        wpPlayer.activatePrevAndNextBtn();
                    }
                    else {
                        wpPlayer.deactivatePrevAndNextBtn();
                    }
                }
                else {
                    wpPlayer.second_controls_active = '';
                    wpPlayer.loadTrack('', '', '/files/music/audios/default.mp3', '00:00')
                }
                //
                if (old_track_info) {
                    var old_track_id = old_track_info.track_id;
                    var old_track_album_id = old_track_info.album_id;
                    var old_track_duration = old_track_info.track_duration;
                    $('#mejs-container-' + old_track_id + '_' + old_track_album_id + ' .mejs-revcurrenttime').text(old_track_duration);
                }
            }

        }
        else {
            var playlist = {
                playlist: [],
                active: 0,
                playing: 0,
                id: 0,
                type: ''
            }
            wpPlayer.current_playlist = playlist;
            if (wpPlayer.playing_playlist.type == 'native') {
                wpPlayer.playing_playlist = playlist;
            }
        }
        if (wpPlayer.playlists.length) {
            var do_class_playing = false;
            if (wpPlayer.current_playlist == wpPlayer.playing_playlist) {
                do_class_playing = true;
            }
            wpPlayer.showPlaylistDetail(wpPlayer.current_playlist, false, {}, do_class_playing);
        }
        else {
            wpPlayer.showPlaylistDetail(null, false);
        }

    };

    wpPlayer.showUpdatePlaylistDetailPage = function(playlist_info) {
        var
                playlist_id = playlist_info.id
                , playlist_title = playlist_info.title
                , playlist = playlist_info.playlist
                ;
        if (wpPlayer.playlists.length) {
            for (var i = 0; i < wpPlayer.playlists.length; i++) {
                if (wpPlayer.playlists[i]['id'] == playlist_id) {
                    wpPlayer.playlists[i]['title'] = playlist_title;
                    var temp = [];
                    for (var j = 0; j < playlist.length; j++) {
                        for (var z = 0; z < wpPlayer.playlists[i]['playlist'].length; z++) {
                            if (playlist[j]['track_id'] == wpPlayer.playlists[i]['playlist'][z]['track_id']) {
                                temp.push(wpPlayer.playlists[i]['playlist'][z]);
                            }
                        }
                    }
                    wpPlayer.playlists[i]['playlist'] = temp;
                    var do_class_playing = false;
                    if (wpPlayer.current_playlist == wpPlayer.playing_playlist) {
                        do_class_playing = true;
                    }
                    wpPlayer.showPlaylistDetail(wpPlayer.current_playlist, false, {}, do_class_playing);
                }
            }
        }
    };
    wpPlayer.removeSelectOption = function(value) {
        $('#mejs-playlists-playlist_title-sel').find('option[value="' + value + '"]').remove();
        $('#mejs-playlists-playlist_title-sel').next().find('li[data-value="' + value + '"]').remove();
    };

    wpPlayer.addPlaylist = function(playlist_title) {
        if (wpPlayer.ajax_active) {
            return;
        }
        wpPlayer.ajax_active = true;
        var error = '';
        var set_query_string_part = '';
        if (playlist_title == '' || playlist_title == 'Введите название плейлиста') {
            error += 'Введите название плейлиста';
        }
        else {
            if (set_query_string_part) {
                set_query_string_part += '&';
            }
            set_query_string_part += 'playlist_title=' + playlist_title;
        }

        if (error) {
            errorMessage(error);
            wpPlayer.ajax_active = false;
            return;
        }
        $.ajax({
            url: base_url + '/playlist',
            type: 'POST',
            data: '' + set_query_string_part,
            dataType: 'json',
            success: function(data) {
                var
                        playlist_info = data.playlist_info
                        , playlist_id = playlist_info.id
                        , playlist_title = playlist_info.title
                        , user_id = playlist_info.user_id
                        , my_id = playlist_info.my_id
                        , perfomer_id = playlist_info.perfomer_id
                        , community_id = playlist_info.community_id
                        ;
                // удалим не нужную опцию в селекте
                wpPlayer.removeSelectOption(0);

                wpPlayer.showNewPlaylist(playlist_id, playlist_title, user_id, my_id, perfomer_id, community_id);
                wpPlayer.ajax_active = false;
            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
                wpPlayer.ajax_active = false
            }

        });
    };

    wpPlayer.deletePlaylist = function(playlist_id) {
        if (wpPlayer.ajax_active) {
            return;
        }
        wpPlayer.ajax_active = true;

        $.ajax({
            url: base_url + '/playlist/' + playlist_id,
            type: "DELETE",
            dataType: 'json',
            success: function(data) {
                wpPlayer.showAfterDeletePlaylistlPage(playlist_id);
                wpPlayer.ajax_active = false;
            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
                wpPlayer.ajax_active = false;
            }

        });
    };

    wpPlayer.editPlaylist = function(playlist_id, playlist_title, query_string_part, opens) {
        var
                query_string_part = query_string_part || ''
                , opens = opens || {}
        ;
        if (wpPlayer.ajax_active) {
            return;
        }
        wpPlayer.ajax_active = true;
        var error = '';
        if (playlist_title == '') {
            error += 'Введите название плейлиста';

        }
        if (error) {
            errorMessage(error);
            wpPlayer.ajax_active = false;
            return;
        }
        $.ajax({
            url: base_url + '/playlist/' + playlist_id,
            type: "PUT",
            data: query_string_part,
            dataType: 'json',
            success: function(data) {
                wpPlayer.showUpdatePlaylistDetailPage(data.playlist_info);
                wpPlayer.ajax_active = false;
            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
                wpPlayer.ajax_active = false;
            }

        });

    };

    wpPlayer.makePlaylistIsActive = function(playlist_id) {
        if (wpPlayer.ajax_active) {
            return;
        }
        wpPlayer.ajax_active = true;
        var error = '';
        var old_playlist_id = 0;
        if (playlist_id && wpPlayer.playlists.length >= 2 && wpPlayer.current_playlist.id != playlist_id) {
            old_playlist_id = wpPlayer.current_playlist.id;
        }
        else {
            wpPlayer.ajax_active = false;
            return;
        }
        if (error) {
            errorMessage(error);
            wpPlayer.ajax_active = false;
            return;
        }
        $.ajax({
            url: base_url + '/playlist/' + playlist_id + '/activate',
            type: "PUT",
            dataType: 'json',
            success: function(data) {
                wpPlayer.ajax_active = false;
            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
                wpPlayer.ajax_active = false;
            }

        });
    };

    wpPlayer.addTrackPreview = function(track_id, album_id, playlist_id) {
        if (wpPlayer.ajax_active) {
            return;
        }
        wpPlayer.ajax_active = true;

        $.ajax({
            url: base_url + '/track/' + track_id + '/preview',
            type: "POST",
            data: 'album_id=' + album_id + '&playlist_id' + playlist_id,
            dataType: 'json',
            success: function(data) {
                wpPlayer.ajax_active = false;
            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
                wpPlayer.ajax_active = false;
            }

        });
    };

    wpPlayer.makeCurPlaylistAddBtnActive = function() {
        if (wpPlayer.current_playlist != undefined) {
            for (var i in wpPlayer.current_playlist.playlist) {
                var
                        track_info = wpPlayer.current_playlist.playlist[i]
                        , track_id = track_info.track_id
                        , album_id = track_info.album_id
                        ;
                $('#mejs-add-button-btn-' + track_id + '_' + album_id + '').parent().addClass('mejs-added');
            }
        }
    };

    wpPlayer.makePlaylistAddBtnActive = function(playlist_id) {
        for (var i in wpPlayer.playlists) {
            if (wpPlayer.playlists[i].id == playlist_id) {
                for (var j in wpPlayer.playlists[i].playlist) {
                    var
                            track_info = wpPlayer.playlists[i].playlist[j]
                            , track_id = track_info.track_id
                            , album_id = track_info.album_id
                            ;
                    $('#mejs-add-button-btn-' + track_id + '_' + album_id + '').parent().addClass('mejs-added');
                }
                break;
            }
        }
    };

    wpPlayer.removeCurPlaylistAddBtnActive = function() {
        for (var i = 0; i < wpPlayer.current_playlist.playlist.length; i++) {
            var
                    track_info = wpPlayer.current_playlist.playlist[i]
                    , track_id = track_info.track_id
                    , album_id = track_info.album_id
                    ;
            $('#mejs-add-button-btn-' + track_id + '_' + album_id + '').parent().removeClass('mejs-added');
        }
    };

    wpPlayer.activatePrevAndNextBtn = function() {
        if (wpPlayer.player.additionalControls.prevIsDisabled && wpPlayer.player.additionalControls.nextIsDisabled) {
            wpPlayer.player.additionalControls.prevIsDisabled = false;
            wpPlayer.player.additionalControls.nextIsDisabled = false;
            wpPlayer.player.additionalControls.prev.removeClass('mejs-prev-disabled').find('button').css({cursor: 'pointer'});
            wpPlayer.player.additionalControls.next.removeClass('mejs-next-disabled').find('button').css({cursor: 'pointer'});
        }

    };

    wpPlayer.deactivatePrevAndNextBtn = function() {
        if (!wpPlayer.player.additionalControls.prevIsDisabled && !wpPlayer.player.additionalControls.nextIsDisabled) {
            wpPlayer.player.additionalControls.prevIsDisabled = true;
            wpPlayer.player.additionalControls.nextIsDisabled = true;
            wpPlayer.player.additionalControls.prev.addClass('mejs-prev-disabled').find('button').css({cursor: 'default'});
            wpPlayer.player.additionalControls.next.addClass('mejs-next-disabled').find('button').css({cursor: 'default'});
        }
    };

    wpPlayer.activatePlayBtn = function() {
        if (wpPlayer.player.additionalControls.playIsDisabled) {
            wpPlayer.player.additionalControls.playIsDisabled = false;
            wpPlayer.player.additionalControls.playpause.removeClass('mejs-play-disabled').find('button').css({cursor: 'pointer'});
        }
    };

    wpPlayer.deactivatePlayBtn = function() {
        if (!wpPlayer.player.additionalControls.playIsDisabled) {
            wpPlayer.player.additionalControls.playIsDisabled = true;
            wpPlayer.player.additionalControls.playpause.addClass('mejs-play-disabled').find('button').css({cursor: 'default'});
        }
    };

    wpPlayer.setPlayingTrack = function(track_id) {
        var playlist = wpPlayer.playing_playlist['playlist'];
        for (var i = 0; i < playlist.length; i++) {
            if (playlist[i]['track_id'] == track_id) {
                wpPlayer.playing_playlist['playing'] = i;
            }
        }
    };

    wpPlayer.getPlayingTrack = function() {
        var playlist = wpPlayer.playing_playlist['playlist'];
        var playing = wpPlayer.playing_playlist['playing'];
        var track_id = playlist[playing]['track_id'];
        return track_id;
    };

    wpPlayer.setPlayerControlsWidth = function(container_id, controls_width) {
        if (container_id && controls_width) {
            $('#' + container_id).each(function() {
                var
                        old_mejs_controls_width = $(this).find('.mejs-controls').width()
                        , old_mejs_controls_inside_center_width = $(this).find('.mejs-controls-inside-center').width()
                        , old_mejs_time_rail_width = $(this).find('.mejs-time-rail').width()

                        , shift = controls_width - old_mejs_controls_width

                        , mejs_controls_width = old_mejs_controls_width + shift
                        , mejs_controls_inside_center_width = old_mejs_controls_inside_center_width + shift
                        , mejs_time_rail_width = old_mejs_time_rail_width + shift
                        ;
                $(this).find('.mejs-controls').width(mejs_controls_width);
                $(this).find('.mejs-controls-inside-center').width(mejs_controls_inside_center_width);
                $(this).find('.mejs-time-rail').width(mejs_time_rail_width);
            });
        }
    };
    wpPlayer.getHtmlCode = function(track_id, player_width) {
        return '<iframe src="' + base_url + '/wp_player/index.php?id=' + track_id + '" width="' + player_width + 'px" height="48px" scrolling="no" frameborder="0" marginheight="0" marginwidth="0"></iframe>';
    };
    wpPlayer.makePlayerHtmlCode = function(track_id, album_id, player_width) {
        $("#html_code_tmpl")
                .tmpl({
                    track_id: track_id
                    , album_id: album_id
                    , player_width: player_width
                    , html_code: wpPlayer.conv(wpPlayer.getHtmlCode(track_id, player_width))
                })
                .insertAfter('#mejs-container-' + track_id + '_' + album_id);

        $('#mejs-player_width-' + track_id + '_' + album_id).bind('change', function(event) {
            var
                    sufix = this.id.substring(this.id.lastIndexOf('-') + 1)
                    , data = JSON.parse($('#mejs-container-' + sufix).attr('data-info'))
                    ;
            var
                    track_id = data.track_id
                    , album_id = data.album_id
                    ;
            var player_width = parseInt($(this).val());
            $('#mejs-html_code-' + track_id + '_' + album_id).val(wpPlayer.getHtmlCode(track_id, player_width));

        });
    };
    /**
     * Покажем текст песни
     * @param {jQuery|string|} el объект jQuery или селектор
     * @param {number} track_id
     * @param {number} album_id
     */
    wpPlayer.showTrackContent = function(el, track_id, album_id) {
        wpPlayer.getTrackContent(el, track_id, album_id);
        var $el = (typeof el == 'string' ? $('#' + el) : $(el));
        $el.toggleClass('open');
    };

    wpPlayer.getTrackContent = function(el, track_id, album_id) {
        var
                $el = (typeof el == 'string' ? $('#' + el) : $(el))
                , check_ajax = $el.data('check_ajax')
                ;
        if (check_ajax) {
            return;
        }
        if (wpPlayer.ajax_active) {
            return;
        }
        wpPlayer.ajax_active = true;

        $.ajax({
            url: base_url + '/track/' + track_id + '/content',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $el.data('check_ajax', true);

                var track_content = data.track_content;
                if (track_content) {
                    $('#mejs-lyrics-' + track_id + '_' + album_id).html(track_content);
                }
                wpPlayer.ajax_active = false;
            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
                wpPlayer.ajax_active = false;
            }

        });
    };

    wpPlayer.getFavoriteTracks = function() {
        if (wpPlayer.ajax_active) {
            return;
        }
        wpPlayer.ajax_active = true;

        $.ajax({
            async: false,
            url: base_url + '/tracks/favorite',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                var id = Math.floor(Math.random( ) * (999999)).toString();
                var playlist = data.favorite_tracks || [];
                var playlist = {
                    playlist: playlist,
                    active: 0,
                    playing: 0,
                    id: id,
                    type: 'favorite_tracks'
                }

                wpPlayer.current_playlist = playlist;
                wpPlayer.playing_playlist = playlist;
                wpPlayer.ajax_active = false;
            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
                wpPlayer.ajax_active = false;
            }

        });
    };

    wpPlayer.getLastTracks = function() {
        if (wpPlayer.ajax_active) {
            return;
        }

        wpPlayer.ajax_active = true;

        $.ajax({
            async: false,
            url: base_url + '/tracks/last',
            type: 'GET',
            dataType: 'json',
            success: function(data) {

                var id = Math.floor(Math.random( ) * (999999)).toString();
                var playlist = data.last_tracks || [];
                var playlist = {
                    playlist: playlist,
                    active: 0,
                    playing: 0,
                    id: id,
                    type: 'last_tracks'
                }

                wpPlayer.current_playlist = playlist;
                wpPlayer.playing_playlist = playlist;
                wpPlayer.ajax_active = false;

            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
                wpPlayer.ajax_active = false;
            }

        });
    };
    wpPlayer.getAudioAlbumTracksHolder = function(data) {
        return $("#audio_album_tracks_holder_tmpl").tmpl(data);
    };

    wpPlayer.setAudioAlbumTracksHolderEvents = function(context) {
        context.find('[id^="mejs-playpause-button-btn-"]').bind('click.mejs-playpause-button-btn', function(event) {
            event.preventDefault();
            var
                    sufix = this.id.substring(this.id.lastIndexOf('-') + 1)
                    , data = JSON.parse($('#mejs-container-' + sufix).attr('data-info'))
                    ;
            var
                    track_id = data.track_id
                    , album_id = data.album_id
                    , perfomer_name = data.perfomer_name
                    , track_title = data.track_title
                    , src = data.src
                    , track_duration = data.track_duration
                    ;
            wpPlayer.playBtnInitSecondControls(track_id, album_id, perfomer_name, track_title, src, track_duration);
        });
        context.find('[id^="mejs-title-track-lnk-"]').bind('click.mejs-title-track-lnk', function(event) {
            event.preventDefault();
            var
                    sufix = this.id.substring(this.id.lastIndexOf('-') + 1)
                    , data = JSON.parse($('#mejs-container-' + sufix).attr('data-info'))
                    ;
            var
                    track_id = data.track_id
                    , album_id = data.album_id
                    ;
            wpPlayer.showTrackContent('mejs-lyrics-' + track_id + '_' + album_id, track_id, album_id);
        });
        Shadowbox.init();
        context.find('[id^="mejs-video-"]').each(function() {
            var
                    sufix = this.id.substring(this.id.lastIndexOf('-') + 1)
                    , data = JSON.parse($('#mejs-container-' + sufix).attr('data-info'))
                    ;
            var
                    track_id = data.track_id
                    , album_id = data.album_id
                    ;
            Shadowbox.clearGallery('TrackVideo-' + track_id + '_' + album_id);
            Shadowbox.setup('#mejs-video-' + track_id + '_' + album_id, {
                gallery: 'TrackVideo-' + track_id + '_' + album_id
            });
        });
        context.find('[id^="mejs-video-"]').bind('click', function(event) {
            event.preventDefault();
            wpPlayer.player.pause();
        });
        context.find('[id^="mejs-add-button-btn-"]').bind('click.mejs-add-button-btn', function(event) {
            var
                    sufix = this.id.substring(this.id.lastIndexOf('-') + 1)
                    , data = JSON.parse($('#mejs-container-' + sufix).attr('data-info'))
                    ;
            var
                    track_id = data.track_id
                    , album_id = data.album_id
                    , perfomer_name = data.perfomer_name
                    , track_title = data.track_title
                    , src = data.src
                    , track_duration = data.track_duration
                    ;

            var playlist_id = wpPlayer.current_playlist['id'];

            wpPlayer.addTrackInPlaylist(track_id, album_id, playlist_id);
        });
        context.find('[id^="music-likes-"]').each(function() {
            var
                    sufix = this.id.substring(this.id.lastIndexOf('-') + 1)
                    , data = JSON.parse($('#mejs-container-' + sufix).attr('data-info'))
                    ;
            var
                    track_id = data.track_id
                    , like_id = data.like_id
                    , user_id = data.user_id
                    ;
            
            new wpPlayer.Like({
                track_id: track_id
                , my_id: wpUser.id
                , like_id: like_id
                , user_id: user_id
                , node_name: wpUser.login
                , element: $(this)
            });
        });
        $('[id^="mejs-tag-button-btn-"]').bind('click', function(event) {
            var
                    sufix = this.id.substring(this.id.lastIndexOf('-') + 1)
                    , data = JSON.parse($('#mejs-container-' + sufix).attr('data-info'))
                    ;
            var
                    track_id = data.track_id
                    , album_id = data.album_id
                    ;

            if (!$(this).parent().is('.mejs-open_html_code')) {
                wpPlayer.makePlayerHtmlCode(track_id, album_id, 400)
                $(this).parent().addClass('mejs-open_html_code');
            }
            else {
                $('#mejs-html_code-cnt-' + sufix).remove();
                $(this).parent().removeClass('mejs-open_html_code');
            }

        });
    };

    wpPlayer.showAudioAlbumTracksHolder = function(data) {
        var context = $("#audio-album-tracks-wraper");
        context.html(this.getAudioAlbumTracksHolder(data));
        this.setAudioAlbumTracksHolderEvents(context);
    };
    /* Вспомогательные инструменты */
    wpPlayer.str_replace = function(search, replace, subject) {
        if (!(replace instanceof Array)) {
            replace = new Array(replace);
            if (search instanceof Array) {
                while (search.length > replace.length) {
                    replace[replace.length] = replace[0];
                }
            }
        }
        if (!(search instanceof Array))
            search = new Array(search);
        while (search.length > replace.length) {
            replace[replace.length] = '';
        }
        if (subject instanceof Array) {
            for (k in subject) {
                subject[k] = wpPlayer.str_replace(search, replace, subject[k]);
            }
            return subject;
        }
        for (var k = 0; k < search.length; k++) {
            var i = subject.indexOf(search[k]);
            while (i > -1) {
                subject = subject.replace(search[k], replace[k]);
                i = subject.indexOf(search[k], i);
            }
        }
        return subject;
    }
    wpPlayer.conv = function(e_text) {
        var res = "";
        res = wpPlayer.str_replace(new Array("&", "'", "\"", "<", ">"), new Array("&amp;", "&#39;", "&quot;", "&lt;", "&gt;"), e_text);
        return res;

    }
    wpPlayer.check_cuselect_active = '';
    wpPlayer.close_cuselect = '';
    wpPlayer.cuselect = function(select, container) {
        var container = container || document;
        $(select, container).each(function() {
            var
                    classAttr = $(this).attr('class')
                    , $select = $(this)
                    , select = this
                    , options = []
                    , selected_option_caption = ''
                    ;
            /* установим по умолчанию
             $select.find('option').each(function(index){
             if(this.defaultSelected){
             $(this).closest('select').val([$(this).val()]);
             }
             });
             */
            $select.css({display: 'none'});
            options = $select.find('option').map(function() {
                var
                        value = this.value
                        , selected = ''
                        , active = ''
                        , caption = $(this).text()
                        ;
                if (this.selected) {
                    selected = 'selected="selected"';
                    selected_option_caption = caption;
                    active = 'active';
                }
                return {value: value, caption: caption, selected: selected, active: active}
            }).get();

            $("#cuselect").tmpl({
                classAttr: classAttr
                , options: options
                , selected_option_caption: selected_option_caption
            })
                    .bind('click', function(event) {
                        event.stopPropagation();
                        var
                                el = event.target
                        $el = $(el)
                        $select = $(this).prev()
                        select = $select.get(0)
                        select_id = select.id
                                ;
                        if (wpPlayer.check_cuselect_active && wpPlayer.check_cuselect_active != select_id) {
                            $('#' + wpPlayer.check_cuselect_active).next().removeClass('open');
                            //
                            if (wpPlayer.close_cuselect == wpPlayer.check_cuselect_active) {
                                clearTimeout(wpPlayer.timer_close_cuselect);
                            }
                            wpPlayer.close_cuselect = '';
                            //
                            wpPlayer.check_cuselect_active = '';
                        }
                        wpPlayer.check_cuselect_active = select_id;
                        //
                        if ($el.is('.cuselect-selected_option_caption') || $el.is('.cuselect-arrow-spn')) {
                            $(this).toggleClass('open');
                        } else
                        if ($el.is('.cuselect-itm')) {
                            if (!$el.is('.active')) {
                                var
                                        value = $el.attr('data-value')
                                caption = $el.text()
                                        ;
                                $('.cuselect-selected_option_caption', this).text(caption);
                                $('.cuselect-itm.active', this).removeClass('active');
                                $el.addClass('active');
                                $(this).toggleClass('open');//должно быть перед вызовом $select.change(), иначе не закроется из-за конфликта с $(document).bind('click', function(event)
                                wpPlayer.check_cuselect_active = '';
                                $select.val([value]);
                                $select.change();
                            }
                            else {
                                $(this).toggleClass('open');
                                wpPlayer.check_cuselect_active = '';
                            }
                        }

                    })
                    .bind('mouseleave', function() {
                        var
                                $select = $(this).prev()
                        select = $select.get(0)
                        select_id = select.id
                                ;
                        if ($(this).is('.open')) {
                            wpPlayer.close_cuselect = select_id;
                            wpPlayer.timer_close_cuselect = setTimeout(function() {
                                if (wpPlayer.close_cuselect) {
                                    $('#' + wpPlayer.close_cuselect).next().removeClass('open');
                                    wpPlayer.close_cuselect = '';
                                }
                            }, 100000);
                        }
                    })
                    .bind('mouseenter', function() {
                        var
                                $select = $(this).prev()
                        select = $select.get(0)
                        select_id = select.id
                                ;
                        if (wpPlayer.close_cuselect == select_id) {
                            clearTimeout(wpPlayer.timer_close_cuselect);
                        }
                    })
                    .insertAfter(this);
            $(document).unbind('click.cuselect').bind('click.cuselect', function(event) {
                if (wpPlayer.check_cuselect_active && wpPlayer.close_cuselect) {
                    var
                            el = event.target
                    $el = $(el)
                    classAttr = $el.attr('class')
                            ;
                    if (classAttr.indexOf('cuselect-') != -1) {
                        return;
                    }
                    else {
                        $('#' + wpPlayer.close_cuselect).next().removeClass('open');
                        wpPlayer.close_cuselect = '';
                    }
                }
            });
        });
    };

    wpPlayer.check_cumenu_active = '';
    wpPlayer.close_cumenu = '';
    wpPlayer.cumenu = function(selector, container) {
        var container = container || document;
        $(selector, container).each(function() {
            var
                    $menu = $(this)
            menu = this
                    ;
            $menu.removeClass('if-no-js')
                    .bind('click', function(event) {
                        event.stopPropagation();
                        var
                                el = event.target
                        $el = $(el)
                        menu = this
                        $menu = $(this)
                        menu_id = this.id
                                ;
                        if (wpPlayer.check_cumenu_active && wpPlayer.check_cumenu_active != menu_id) {
                            $('#' + wpPlayer.check_cumenu_active).removeClass('open');
                            //
                            if (wpPlayer.close_cumenu == wpPlayer.check_cumenu_active) {
                                clearTimeout(wpPlayer.timer_close_cumenu);
                            }
                            wpPlayer.close_cumenu = '';
                            //
                            wpPlayer.check_cumenu_active = '';
                        }
                        wpPlayer.check_cumenu_active = menu_id;
                        //
                        if ($el.is('.cumenu-active_option_caption') || $el.is('.cumenu-arrow-spn')) {
                            $(this).toggleClass('open');
                        } else
                        if ($el.is('.cumenu-lnk')) {
                            if (!$el.is('.active')) {
                                var
                                        caption = $el.text()
                                        ;
                                $('.cumenu-active_option_caption', this).text(caption);
                                $('.cumenu-itm.active', this).removeClass('active');
                                $el.closest('.cumenu-itm').addClass('active');
                                $(this).toggleClass('open');
                                wpPlayer.check_cumenu_active = '';
                            }
                            else {
                                $(this).toggleClass('open');
                                wpPlayer.check_cumenu_active = '';
                            }
                        }

                    })
                    .bind('mouseleave', function() {
                        var
                                $menu = $(this)
                        menu = this
                        menu_id = menu.id
                                ;
                        if ($(this).is('.open')) {
                            wpPlayer.close_cumenu = menu_id;
                            wpPlayer.timer_close_cumenu = setTimeout(function() {
                                if (wpPlayer.close_cumenu) {
                                    $('#' + wpPlayer.close_cumenu).removeClass('open');
                                    wpPlayer.close_cumenu = '';
                                }
                            }, 100000);
                        }
                    })
                    .bind('mouseenter', function() {
                        var
                                $menu = $(this)
                        menu = this
                        menu_id = menu.id
                                ;
                        if (wpPlayer.close_cumenu == menu_id) {
                            clearTimeout(wpPlayer.timer_close_cumenu);
                        }
                    });
            $(document).unbind('click.cumenu').bind('click.cumenu', function(event) {
                if (wpPlayer.check_cumenu_active && wpPlayer.close_cumenu) {
                    var
                            el = event.target
                    $el = $(el)
                    classAttr = $el.attr('class')
                            ;
                    if (classAttr.indexOf('cumenu-') != -1) {
                        return;
                    }
                    else {
                        $('#' + wpPlayer.close_cumenu).removeClass('open');
                        wpPlayer.close_cumenu = '';
                    }
                }
            });
        });
    };
    wpPlayer.isKeypress = function(event, key) {//или keydown или keyup
        var event = event || window.Event || window.event;
        var key = key || 0;
        var keycode, keyChar;
        if (event.keyCode)
            keycode = event.keyCode;
        else if (event.which)
            keycode = event.which;
        keyChar = String.fromCharCode(keycode);

        if (keycode == key) {
            return true;
        } else {
            return false;
        }
    }
    wpPlayer.serialize = function($form) {
        if (typeof $form == 'string' && $form != '') {
            $form = $('#' + $form);
        }
        if ($form.length > 0) {
            var $els = $form.find('input, select, textarea').not('[data-form]');
            var form_id = $form.get(0).id;
            if (form_id) {
                $els = $els.add($('input, select, textarea').filter('[data-form="' + form_id + '"]'));
            }
            var data = '';
            $els.each(function() {
                if (this.nodeName.toLowerCase() == 'input') {
                    if (this.type == 'radio' || this.type == 'checkbox') {
                        if (!this.checked) {
                            return true;
                        }
                    }
                }
                if (this.name) {
                    var
                            values = [],
                            value = ''
                            ;

                    if ((this.nodeName.toLowerCase() == 'select') && this.multiple) {
                        values = $(this).val();
                    } else {
                        values[0] = this.value;
                    }

                    for (key in values) {
                        if (data) {
                            data += "&";
                        }
                        data += this.name + "=" + encodeURIComponent(values[key]);
                    }
                }
            });
        }
        return data;
    };

    wpPlayer.shuffle = function(array) {
        return array.sort(function() {
            return 0.5 - Math.random()
        });
    };
    wpPlayer.Like = (function($, window){
        var warningMessage = window.warningMessage;
        
        function Like() {
            this.init.apply(this, arguments);
        }
        $.extend(Like.prototype, {
            defaults: {
                track_id: 0
                , like_id: 0
                , user_id: 0
                , my_id: 0
                , base_url: window.base_url
                , node_name: ""
                , element: $()
            }
            , init: function(options) {
                $.extend(true, this, this.defaults, options);
                
                this._url = this.base_url + '/' + this.node_name + '/object/' + this.track_id;
                
                this.setLikeBtnEvents();
            }
            , addLikeOnBeforeSend: function() {
                this.like_id = this.my_id;
                this.element.removeClass("like-up-icon").addClass("like-down-icon");
            }
            , addLikeOnSuccess: function(data) {
                this.ajax_in_action = false;
            }
            , addLikeOnError: function(data, status) {
                this.ajax_in_action = false;
                this.removeLikeOnBeforeSend();
            }
            , addLike: function() {
                if (!this.my_id) {
                    warningMessage('Это действие доступно только для авторизованных пользователей.');
                    return;
                }
                if (this.my_id == this.user_id) {
                    return;
                }
                if (this.ajax_in_action) {
                    return;
                }
                this.ajax_in_action = true;

                this.addLikeOnBeforeSend();

                $.ajax({
                    url: this._url + '/like',
                    type: 'POST',
                    data: "user_id=" + this.my_id,
                    dataType: 'json',
                    context: this,
                    success: this.addLikeOnSuccess,
                    error: this.addLikeOnError
                });
            }
            , removeLikeOnBeforeSend: function() {
                this.like_id = 0;
                this.element.removeClass("like-down-icon").addClass("like-up-icon");
            }
            , removeLikeOnSuccess: function(data) {
                this.ajax_in_action = false;
            }
            , removeLikeOnError: function(data, status) {
                this.ajax_in_action = false;
                this.addLikeOnBeforeSend();
            }
            , removeLike: function() {
                if (!this.my_id) {
                    warningMessage('Это действие доступно только для авторизованных пользователей.');
                    return;
                }
                if (this.ajax_in_action) {
                    return;
                }
                this.ajax_in_action = true;

                this.removeLikeOnBeforeSend();

                $.ajax({
                    url: this._url + '/like/' + this.like_id + "?user_id=" + this.my_id,
                    type: 'DELETE',
                    dataType: 'json',
                    context: this,
                    success: this.removeLikeOnSuccess,
                    error: this.removeLikeOnError
                });
            }
            , addRemoveLike: function() {
                if (this.like_id == 0) {
                    this.addLike();
                }
                else {
                    this.removeLike();
                }
            }
            , likeBtntOnClick: function(event) {
                this.addRemoveLike();
            }
            , setLikeBtnEvents: function() {
                this.element.on("click", $.proxy(this, "likeBtntOnClick"));
            }
        });
        return Like;
    }($, window));
    return wpPlayer;
});