<script id="wp_player_tmpl" type="text/x-jquery-tmpl">
<div id="wp_player" class="wp-player-main">
    <audio id="wp-mediaelement">
        <source src="" type="audio/ogg"></source>
        <source src="" type="audio/mp3"></source>
    </audio>
</div>
</script>
<script id="wp_player_main_controls_tmpl" type="text/x-jquery-tmpl">
<div id="wp_player_main_controls" class="mejs-container mejs-wp mini">
    <div class="mejs-inner">
        <div class="mejs-playlists" style="display: ;">
        <div id="mejs-playlists-cnt" class="mejs-playlists-cnt">
    </div>
    <div class="mejs-playlists-triangle"></div>
</div>
<div class="mejs-controls">
    <!-- prev -->
    <div class="mejs-button mejs-prev-button">
        <button></button>
    </div>
    <!-- playpause -->
    <div class="mejs-button mejs-playpause-button mejs-play" id="mejs-playpause-button">
        <button></button>
    </div>
    <!-- next -->
    <div class="mejs-button mejs-next-button">
        <button></button>
    </div>
    <!-- playlist -->
    <div class="mejs-button mejs-playlist-button">
        <button></button>
    </div>
    <!-- volume, horizontal version -->
    <div class="mejs-button mejs-volume-button mejs-mute" style="display:none;">
        <button></button>
    </div>
    <div class="mejs-horizontal-volume-slider">
        <div class="mejs-horizontal-volume-total"></div>
        <div class="mejs-horizontal-volume-current"></div>
        <div class="mejs-horizontal-volume-handle"></div>
    </div>
    <div class="mejs-info">
        <div class="mejs-info-main">
            <!-- currenttime -->
            <div class="mejs-time mejs-currenttime-container">
                <span class="mejs-currenttime">00:00</span>
            </div>
            <!-- revcurrenttime -->
            <div class="mejs-time mejs-revcurrenttime-container" style="display:none;">
                <span class="mejs-revcurrenttime">00:00</span><span class="mejs-minus">-</span>
            </div>
            <!-- loop -->
            <div class="mejs-button mejs-loop-button mejs-loop-off">
                <button></button>
            </div>
            <!-- title -->
            <div class="mejs-title"></div>
            <!-- progress -->
            <div class="mejs-time-rail">
                <span class="mejs-time-total">
                    <span class="mejs-time-total-inside"></span>
                    <span class="mejs-time-loaded"></span>
                    <span class="mejs-time-current"></span>
                    <span class="mejs-time-handle"></span>
                    <span class="mejs-time-float" style="display: none;">
                        <span class="mejs-time-float-current">00:00</span>
                        <span class="mejs-time-float-corner"></span>
                    </span>
                </span>
            </div>
        </div>
        <div class="mejs-info-right"></div>
        </div>
    </div>
    <div class="mejs-controls-right"></div>
    </div>
</div>
</script>
<script id="audio_album_track_tmpl" type="text/x-jquery-tmpl">
<li id="mejs-container-${track.track_id}_${track.album_id}" class="mejs-container mejs-wp-2" data-info='{"track_id": "${track.track_id}", "album_id": "${track.album_id}", "perfomer_name": "${track.perfomer_name}", "track_title": "${track.track_title}", "src": "${track.src}", "track_duration": "${track.track_duration}", "like": ${track.user_id}}'>
    <div class="mejs-inner">
        <div class="mejs-controls">
            <div class="mejs-controls-inside-left">
                <!-- loop -->
                <div class="mejs-button mejs-loop-button mejs-loop-off">
                    <button data-tip="default_tip" title="Повторять эту композицию"></button>
                </div>
                <!-- playpause -->
                <div class="mejs-button mejs-playpause-button mejs-play" >
                    <button data-tip="default_tip" id="mejs-playpause-button-btn-${track.track_id}_${track.album_id}" title="Играть/пауза"></button>
                </div>
            </div>
            <div class="mejs-controls-inside-center">
                <!-- playlist_type -->
                <div class="mejs-playlist_type">
                    <span class="mejs-native">активный плейлист</span>
                </div>
                <!-- title -->
                <div class="mejs-title">
                    {{if track.track_content_exist}}
                        <a id="mejs-title-track-lnk-${track.track_id}_${track.album_id}">${track.track_title}</a>
                    {{else}}
                        <span style="color:#4A4A4A;cursor:default;">${track.track_title}</span>
                    {{/if}}
                </div>
                <!-- progress -->
                <div class="mejs-time-rail">
                    <span class="mejs-time-total"></span>
                    <span class="mejs-time-loaded"></span>
                    <span class="mejs-time-current"></span>
                    <span class="mejs-time-handle"></span>
                    <span class="mejs-time-float">
                        <span class="mejs-time-float-current">00:00</span>
                        <span class="mejs-time-float-corner"></span>
                    </span>    
                </div>
                <!-- volume, horizontal version -->
                <div class="mejs-button mejs-volume-button mejs-mute" style="display:none;">
                    <button></button>
                </div>
                <div class="mejs-horizontal-volume-slider">
                    <div class="mejs-horizontal-volume-total"></div>
                    <div class="mejs-horizontal-volume-current"></div>
                    <div class="mejs-horizontal-volume-handle"></div>
                </div>
                <div class="mejs-lyrics" id="mejs-lyrics-${track.track_id}_${track.album_id}"></div>
                <div class="mejs-line"></div>
            </div>
            <div class="mejs-controls-inside-right">
                {{if track.track_video != ""}}
                    <!-- video -->
                    <div class="mejs-button mejs-video-button">
                        <a id="mejs-video-${track.track_id}_${track.album_id}" href="http://www.youtube.com/embed/${track.track_video}?autoplay=1" data-tip="default_tip"title="Смотреть видео к песни"></a>
                    </div>
                {{/if}}
                <!-- revcurrenttime -->
                <div class="mejs-time mejs-revcurrenttime-container">
                    <span class="mejs-revcurrenttime">${track.track_duration}</span>
                </div>
                <!-- add -->
                <div class="mejs-button mejs-add-button">
                    <button data-tip="default_tip" id="mejs-add-button-btn-${track.track_id}_${track.album_id}" title="Добавить в плейлист"></button>
                </div>
                <!-- likes -->
                <div class="mejs-button mejs-likes-button">
                    <a id="music-likes-${track.track_id}_${track.album_id}" class="${(track.like_id == 0 ? 'like-up-icon' : 'like-down-icon')}">
                    </a>
                </div>
                <!-- tag -->
                <div class="mejs-button mejs-tag-button">
                    <button data-tip="default_tip" id="mejs-tag-button-btn-${track.track_id}_${track.album_id}" title="Получить код плеера"></button>
                </div>
            </div>
        </div>
    </div>
</li>
</script>
<script id="audio_album_tracks_holder_tmpl" type="text/x-jquery-tmpl">
<div class="audio-album-tracks clr">
    <ul class="audio-album-tracks-holder mejs-container-lst list">
    {{if tracks && tracks.length > 0}}
        {{each(trackIndex, track) tracks}}
            {{tmpl({track: track}) "#audio_album_track_tmpl"}}
        {{/each}}
    {{/if}}
    </ul>
</div>
</script>
<script id="cuselect" type="text/x-jquery-tmpl">
<div class="cuselect ${classAttr}">
    <div class="cuselect-header">
        <div class="cuselect-arrow">
            <span class="cuselect-arrow-spn"></span>
        </div>
        <div class="cuselect-selected_option_caption">${selected_option_caption}</div>
    </div>
    <table cellspacing="0" cellpadding="0" border="0" class="cuselect-wrap">
        <tbody>
            <tr>
                <td colspan="3" class="cuselect-triangle-top">
                    <span class="cuselect-triangle-top-spn"></span>
                </td>
            </tr>
            <tr>
                <td class="cuselect-corner-top-left"></td>
                <td class="cuselect-border-top"></td>
                <td class="cuselect-corner-top-right"></td>
            </tr>
            <tr>
                <td  class="cuselect-border-left"></td>
                <td  class="cuselect-cnt">
                    <ul class="cuselect-lst">
                    {{each(optionIndex, option) options}}
                        <li class="cuselect-itm ${option['active']}" data-value="${option['value']}">${option['caption']}</li>
                    {{/each}}
                    </ul>
                </td>
                <td class="cuselect-border-right"></td>
            </tr>
            <tr>
                <td class="cuselect-corner-bottom-left"></td>
                <td class="cuselect-border-bottom"></td>
                <td class="cuselect-corner-bottom-right"></td>
            </tr>
        </tbody>
    </table>
</div>
</script>
<script id="cumenu" type="text/x-jquery-tmpl">
<div id="${cumenuId}" class="cumenu mejs-playlists-playlist_edit">            
    <div class="cumenu-inside">
        <div class="cumenu-header">
            <div class="cumenu-arrow">
                <span class="cumenu-arrow-spn"></span>
            </div>
            <div class="cumenu-active_option_caption"></div>
        </div>
        <table cellspacing="0" cellpadding="0" border="0" class="cumenu-wrap">
            <tbody>
                <tr>
                    <td colspan="3" class="cumenu-triangle-top">
                        <span class="cumenu-triangle-top-spn"></span>
                    </td>
                </tr>
                <tr>
                    <td class="cumenu-corner-top-left"></td>
                    <td class="cumenu-border-top"></td>
                    <td class="cumenu-corner-top-right"></td>
                </tr>
                <tr>
                    <td  class="cumenu-border-left"></td>
                    <td  class="cumenu-cnt">
                        <ul class="cumenu-lst">
                        {{if type != 'favorite_tracks' && type != 'last_tracks' && user_id != 0 && my_id != 0 && user_id == my_id}}
                            <li class="cumenu-itm">
                                <a id="mejs-playlists-playlist_edit-lnk-${playlist_id}" class="cumenu-lnk">Редактировать</a>
                            </li>
                            <li class="cumenu-itm">
                                <a id="mejs-playlists-playlist_delete-lnk-${playlist_id}" class="cumenu-lnk">Удалить</a>
                            </li>
                        {{/if}}
                        <li class="cumenu-itm">
                            <a id="mejs-playlists-playlist_add-lnk-${playlist_id}"  class="cumenu-lnk">Добавить</a>
                        </li>
                        <li class="cumenu-itm">
                            <a id="mejs-playlists-playlist_shuffle-lnk-${playlist_id}" class="cumenu-lnk">Перемешать</a>
                        </li>
                    </ul>
                    </td>
                    <td class="cumenu-border-right"></td>
                </tr>
                <tr>
                    <td class="cumenu-corner-bottom-left"></td>
                    <td class="cumenu-border-bottom"></td>
                    <td class="cumenu-corner-bottom-right"></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</script>
<script id="playlistTrack" type="text/x-jquery-tmpl">
{{var playing_class = ''}}
{{if do_class_playing && i == playing}}
    {{var playing_class = 'playing'}}
{{/if}}
<li id="mejs-playlists-playlist_tracks-itm-${object_id}"  class="mejs-playlists-playlist_tracks-itm ${playing_class}">
{{if check_edit}}
   <input type="hidden" name="track_positions[]" value="${object_id}">
    <a id="mejs-playlists-playlist_tracks-delete-lnk-${object_id}" class="mejs-playlists-playlist_tracks-delete-lnk"></a>
    <span class="mejs-playlists-playlist_tracks-duration">${track_duration}</span>
    <span class="mejs-playlists-playlist_tracks-title">${perfomer_name} - ${track_title}</span>
{{else}}
   <span class="mejs-playlists-playlist_tracks-duration">${track_duration}</span>
    <span class="mejs-playlists-playlist_tracks-title">${perfomer_name} - ${track_title}</span>
{{/if}}
</li>
</script>
<script id="playlist" type="text/x-jquery-tmpl">
{{var class_edit = ''}}
{{if check_edit}}
    {{var class_edit = 'edit'}}
{{/if}}
<form id="mejs-playlists-playlist_edit-form" class="${class_edit}">
    <div class="mejs-playlists-top">
        <div class="mejs-playlists-playlist_title">
            {{if !check_edit}}
                <select id="mejs-playlists-playlist_title-sel" class="mejs-playlists-playlist_title-sel" name="playlist_id">
                    {{each(optionIndex, option) options}}
                        <option value="${option['value']}" ${option['selected']}>${option['caption']}</option>
                    {{/each}}
                </select>
            {{else}}
                <input type="hidden" name="playlist_id" value="${playlist_id}" />
                <input type="text" id="playlist_title_edit-${playlist_id}" class="mejs-playlists-playlist_edit-title-inp" name="playlist_title" value="${playlist_title}">
            {{/if}}
        </div>
        {{if playlist_id}}
            {{if !check_edit}}
                {{tmpl({cumenuId: 'mejs-playlists-playlist_edit', type: type, user_id: user_id, my_id: my_id, playlist_id: playlist_id}) '#cumenu'}}
            {{else}}
                <div id="mejs-playlists-playlist_edit" class="mejs-playlists-playlist_edit">
                    <button id="edit_playlist-${playlist_id}" class="mejs-playlists-playlist_edit-save-btn" name="action[${playlist_id}]" value="edit_playlist"></button>
                </div>
            {{/if}}
        {{/if}}
    </div>
    {{var style_scroll = ''}}
    {{if playlist.length > 9}}
        {{var style_scroll = 'overflow-y: scroll;'}}
    {{/if}}
    <ul id="mejs-playlists-content" class="mejs-playlists-content" style="${style_scroll}">
    {{if playlist_id != 0}}
        {{if playlist.length > 0}}
            {{each(trackIndex, track) playlist}}
                {{tmpl({object_id: track.object_id, track_id: track.track_id, perfomer_name: track.perfomer_name, track_title: track.track_title, track_duration: track.track_duration, do_class_playing: do_class_playing, playing: playing, i: trackIndex, check_edit: check_edit}) '#playlistTrack'}}
            {{/each}}
        {{else}}
            <li class="mejs-playlists-playlist_tracks-no">Нет ни одного трека</li>
        {{/if}}
    {{else}}
        <li class="mejs-playlists-playlist_tracks-add">
            <input type="text" id="playlist_title" class="mejs-playlists-playlist_tracks-inp" name="playlist_title" value="Введите название плейлиста">
            <button id="add_playlist" class="mejs-playlists-playlist_tracks-btn" name="action[0]" value="add_playlist">Добавить</button>
            <button id="cancel_playlist" class="mejs-playlists-playlist_tracks-btn" name="action[0]" value="cancel_playlist">Отмена</button>
        </li>
    {{/if}}
    </ul>
</form>
</script>
<script id="html_code_tmpl" type="text/x-jquery-tmpl">
<div id="mejs-html_code-cnt-${track_id}_${album_id}">
    <div class="input-title-holder">
        <label for="html_code" class="input-title input-title-grey input-title-grey-half input-title-grey-left">
            html код
        </label>
        <label for="player_width" class="input-title input-title-grey input-title-grey-half input-title-grey-right">
            Ширина плеера
            <span class="input-tip"> / принять</span>
        </label>
    </div>
    <div class="input-string-holder">
        <div class="ish-left-side">
            <input id="mejs-html_code-${track_id}_${album_id}" name="html_code" type="text" value="${html_code}" class="input-string input-string-no-top-border input-string-half">
        </div>
        <div class="ish-right-side">
            <input id="mejs-player_width-${track_id}_${album_id}" name="player_width" id="player_width" type="text" value="${player_width}" class="input-string input-string-no-top-border input-string-half">
        </div>
    </div>
</div>
</script>