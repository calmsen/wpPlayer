define.amd = false;

var version = "2.0",
    imageSizes = {
        'original': {
            'width': 8616,
            'height': 6912
        },
        'max': {
            'width': 700,
            'height': 600
        },
        'med': {
            'width': 283,
            'height': 283
        },
        'small': {
            'width': 150,
            'height': 150
        },
        'preview': {
            'width': 150,
            'height': 93
        }
    };

requirejs.config({
    urlArgs: 'version='+version,
    waitSeconds: 60,
    baseUrl: '',
    paths: {
        // PLUGINS
        text: '/resources/javascript/requirejs-text-2.0.10',
        /*migrate: '//code.jquery.com/jquery-migrate-1.1.1',
        UI: '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min',*/
        migrate: '/resources/javascript/jquery-migrate-1.1.1.min',
        UI: '/resources/javascript/jQuery-UI-1.10.3/jquery-ui-1.10.4.custom.min',
        json: '/resources/javascript/jquery.json-2.3',
        mousewheel: '/resources/javascript/jquery.mousewheel',
        browser: '/resources/javascript/jquery.browser.min',
        transit: '/resources/javascript/jquery.transit',
        fancybox: '/resources/javascript/fancybox-2.0/jquery.fancybox',
        bxSlider: '/resources/javascript/jquery.bxslider/jquery.bxslider',
        cookie: '/resources/javascript/jquery.cookie',
        alerts: '/resources/javascript/jquery.alerts',
        tmpl: '/resources/javascript/jquery.tmpl',
        carousel: '/resources/javascript/jquery.jcarousel',
        minicolors: '/resources/javascript/jquery.minicolors',
        tinyscrollbar: '/resources/javascript/jquery.tinyscrollbar.min',
        cusel: '/resources/javascript/cusel-min-2.5',
        autosize: '/resources/javascript/autosize-master/jquery.autosize.min',
        xml2json: '/resources/javascript/jquery.xml2json',
        numberMask: '/resources/javascript/number-masks',
        maskInput: '/resources/javascript/jquery.maskedinput-1.3',
        toastmessage: '/resources/javascript/jquery.toastmessage-min',
        resize: '/resources/javascript/common/resize',
        shadowbox: '/resources/javascript/shadowbox-3.0.3/shadowbox',
        ytLoad: '/resources/javascript/ytLoad.jquery',
        Jcrop: '/resources/javascript/jcrop/js/jquery.Jcrop.min',
        wpDatepick: '/resources/javascript/jQuery.Datepick.Package-4.1.0/jquery.datepick',
        wpDatepickRu: '/resources/javascript/jQuery.Datepick.Package-4.1.0/jquery.datepick-ru',
        FileAPI: '/resources/javascript/FileAPI/FileAPI.min',
        CometServerApi: '/resources/javascript/common/CometServerApi',
        MorrisJS: '/resources/javascript/common/morris-0.4.1.min',
        wpPopup: '/resources/javascript/common/popup/wpPopup',
        wpConfigurationProducts: '/resources/javascript/common/products/wpConfigurationProducts',
        wpTogglePopup: '/resources/javascript/common/wpTogglePopup',
        wpHeaderPlaces: '/resources/javascript/common/places/wpHeaderPlaces',
        places: '/resources/javascript/common/places/places',
        wpFixedSideMenu: '/resources/javascript/common/wpFixedSideMenu',
        wpAutocomplete: '/resources/javascript/common/wpAutocomplete',
        wpCheckboxes: '/resources/javascript/common/wpCheckboxes',
        selectAndUpToDateObjects: '/resources/javascript/common/selectAndUpToDateObjects',
        kHtml5: '/resources/javascript/kdesign/html5',
        kScripts: '/resources/javascript/kdesign/scripts',
        kSelectbox: '/resources/javascript/kdesign/selectbox',
        wpImages: '/resources/javascript/common/images/wpImages',
        wpPhotos: '/resources/javascript/common/images/wpPhotos',
        wpFiltersPublic: '/resources/javascript/common/filters/wpFiltersPublic',
        wpFiltersUser: '/resources/javascript/common/filters/wpFiltersUser',
        numberPublic: '/resources/javascript/common/filters/public/number',
        columnPublic: '/resources/javascript/common/filters/public/column',
        radioPublic: '/resources/javascript/common/filters/public/radio',
        selectPublic: '/resources/javascript/common/filters/public/select',
        sizesPublic: '/resources/javascript/common/filters/public/sizes',
        color: '/resources/javascript/common/filters/common/color',
        sizes: '/resources/javascript/common/filters/user/sizes',
        numberUser: '/resources/javascript/common/filters/user/number',
        columnUser: '/resources/javascript/common/filters/user/column',
        radioUser: '/resources/javascript/common/filters/user/radio',
        stringUser: '/resources/javascript/common/filters/user/string',
        wpPages: '/resources/javascript/common/pages/wpPages',
        wpLogo: '/resources/javascript/common/logo/wpLogo',
        logo: '/resources/javascript/common/logo',
        LogoSettings: '/resources/javascript/common/LogoSettings',
        logoLoadingObject: '/resources/javascript/common/logoLoadingObject',
        ShareLike: '/resources/javascript/common/ShareLike',
        ShareLike2: '/resources/javascript/common/ShareLike2',
        ckeditor: '/resources/javascript/ckeditor/adapters/jquery',
        ckeditorAdapters: '/resources/javascript/ckeditor/ckeditor',
        wpCatalog: '/resources/javascript/common/catalog/wpCatalog',
        wpActualPlace: '/resources/javascript/common/places/wpActualPlace',
        Notices: '/resources/javascript/notices/Notices',
        wpUsersSearchFinalValues: '/resources/javascript/common/users/wpUsersSearchFinalValues',
        vk_thumbs: '/resources/javascript/common/vk_thumbs',
        APSchedulerParser: '/resources/javascript/diary/APSchedulerParser',
        moment: '/resources/javascript/diary/moment_2.1.0/moment.min',
        chosen: '/resources/javascript/chosen/chosen.proto.min',
        chosenJquery: '/resources/javascript/chosen/chosen.jquery.min',
        photoSocialGallery : '/resources/javascript/common/photo_social_gallery',
        answers: '/resources/javascript/reviews/answers',
        posters: '/resources/javascript/posters/posters',
        wpDates: '/resources/javascript/common/dates/wpDates',
        wpPostersDates: '/resources/javascript/common/posters/wpPostersDates',
        wpHalls: '/resources/javascript/common/halls/wpHalls',
        arenas: '/resources/javascript/posters/wp-arenas',
        wpComments: '/resources/javascript/common/comments/wpComments',
        wpCirclesLine: '/resources/javascript/common/circles/wpCirclesLine',
        wpCirclesAndFriendsPopup: '/resources/javascript/common/circles/wpCirclesAndFriendsPopup',
        SkillAdmin: '/resources/javascript/skill/SkillAdmin',
        slider: '/resources/javascript/slider',
        fullcalendar: '/resources/javascript/fullcalendar/fullcalendar',
        jobs :'/resources/javascript/jobs/jobs',
        resume: '/resources/javascript/job/resume',
        job: '/resources/javascript/job/job',
        addJqueryPlugin: '/resources/javascript/common/addJqueryPlugin',
        ScrollingElement: '/resources/javascript/common/ScrollingElement',
        UlImages: '/resources/javascript/common/UlImages',
        ajaxfileupload: '/resources/javascript/ajaxfileupload/ajaxfileupload',
        textareaAutoResize: '/resources/javascript/jquery.textareaAutoResize',
        History: '/resources/javascript/common/History',
        jqueryEmotions: '/resources/javascript/jquery.emotions',
        mejs: '/resources/javascript/mediaelement/build/mediaelement-and-player',
        wpPlayer: '/resources/javascript/common/wpPlayer',
        SettingsDenied: '/resources/javascript/common/settings/SettingsDenied',
        FormParser: '/resources/javascript/common/FormParser',
        ADimensionConvertor: '/resources/javascript/dimensionConvertors/ADimensionConvertor',
        MaleClothingDimensionConvertor: '/resources/javascript/dimensionConvertors/MaleClothingDimensionConvertor',
        NoticesRm: '/resources/javascript/rm/NoticesRm',
        bootstrap: '/resources/javascript/rm/bootstrap.min',
        bootbox: '/resources/javascript/rm/bootbox.min',
        jqBootstrapValidation: '/resources/javascript/rm/jqBootstrapValidation',
        Landmark: '/resources/javascript/landmark/landmark',
        jsdiff: '/resources/javascript/jsdiff/diff',
        textDiff: '/resources/javascript/landmark/textDiff',
        resizeImages: '/resources/javascript/common/images/resizeImages',

        // MODULES
        authorization: '/resources/javascript/common/authorization',
        Products: '/resources/javascript/products/Products',
        Blog: '/resources/javascript/blogs/Blog',
        circles: '/resources/javascript/circles/circles',
        news: '/resources/javascript/news/news',
        diary: '/resources/javascript/diary/diary',
        messages: '/resources/javascript/messages/messages',
        wall: '/resources/javascript/wall/wall',
        subscriptions: '/resources/javascript/subscriptions/subscriptions',
        userSettings: '/resources/javascript/settings/settings',
        albumsForOwner: '/resources/javascript/albums/albumsForOwner',
        reviewsForOwner: '/resources/javascript/reviews/reviewsForOwner',
        reviewsForGuest: '/resources/javascript/reviews/reviewsForGuest',
        companiesForOwner: '/resources/javascript/companies/companiesForOwner',
        communitiesForOwner: '/resources/javascript/communities/communitiesForOwner',
        pagesCitiesForOwner: '/resources/javascript/pagesCities/pagesCitiesForOwner',
        CommunityAuthorization: '/resources/javascript/communities/CommunityAuthorization',
        
        // TMPL
        wpPopupTmpl: '/resources/jquery-tmpl/popup/wpPopup',
        wpConfigurationProductsTmpl: '/resources/jquery-tmpl/products/configurations',
        wpHeaderPlacesTmpl: '/resources/jquery-tmpl/places/wpHeaderPlaces',
        wpPagesTmpl: '/resources/jquery-tmpl/pages/wpPages',
        shareLikeTmpl: '/resources/jquery-tmpl/shareLike',
        shareLikeTmpl2: '/resources/jquery-tmpl/shareLike2',
        logoTmpl: '/resources/jquery-tmpl/logoSettings',
        wpCatalogTmpl: '/resources/jquery-tmpl/catalog/wpCatalog',
        wpActualPlaceTmpl: '/resources/jquery-tmpl/places/wpActualPlace',
        wpPlacesNewTmpl: '/resources/jquery-tmpl/places/wpPlacesNew',
        wpImagesTmpl: '/resources/jquery-tmpl/images/wpImages',
        wpPhotosTmpl: '/resources/jquery-tmpl/images/wpPhotos',
        numberPublicTmpl: '/resources/jquery-tmpl/filters/public/number',
        columnPublicTmpl: '/resources/jquery-tmpl/filters/public/column',
        radioPublicTmpl: '/resources/jquery-tmpl/filters/public/radio',
        selectPublicTmpl: '/resources/jquery-tmpl/filters/public/select',
        sizesPublicTmpl: '/resources/jquery-tmpl/filters/public/sizes',
        numberUserTmpl: '/resources/jquery-tmpl/filters/user/number',
        columnUserTmpl: '/resources/jquery-tmpl/filters/user/column',
        radioUserTmpl: '/resources/jquery-tmpl/filters/user/radio',
        stringUserTmpl: '/resources/jquery-tmpl/filters/user/string',
        chosenSelectTmpl: '/resources/jquery-tmpl/filters/user/chosenSelect',
        colorUserTmpl: '/resources/jquery-tmpl/filters/common/color',
        sizesUserTmpl: '/resources/jquery-tmpl/filters/user/sizes',
        wpUsersSearchTmpl: "/resources/jquery-tmpl/users/wpUsersSearch",
        wpUsersSearchFinalValuesTmpl: "/resources/jquery-tmpl/users/wpUsersSearchFinalValues",
        dialogsTmpl: "/resources/jquery-tmpl/messages/dialogs",
        wpAutocompleteTmpl: "/resources/jquery-tmpl/autocomplete/wpAutocomplete",
        photoSocialGalleryTmpl: "/resources/jquery-tmpl/photoSocialGallery",
        noticeViewTmpl: "/resources/jquery-tmpl/notices/noticeView",
        formsTemplatesTmpl: "/resources/jquery-tmpl/forms/formsTemplates",
        answersTmpl: "/resources/jquery-tmpl/reviews/answers",
        wpCommentsTmpl: "/resources/jquery-tmpl/comments/wpComments",
        postersTmpl: "/resources/jquery-tmpl/posters/posters",
        wpDatesTmpl: "/resources/jquery-tmpl/dates/wpDates",
        wpPostersDatesTmpl: "/resources/jquery-tmpl/posters/wpPostersDates",
        wpLogoTmpl: "/resources/jquery-tmpl/logo/wpLogo",
        wpHallsTmpl: '/resources/jquery-tmpl/halls/wpHalls',
        wpCirclesLineTmpl: '/resources/jquery-tmpl/circles/wpCirclesLine',
        wpCirclesAndFriendsPopupTmpl: '/resources/jquery-tmpl/circles/wpCirclesAndFriendsPopup',
        eventsListTmpl: '/resources/jquery-tmpl/diary/eventsList',
        treeTpl_SkillAdmin: '/resources/jquery-tmpl/skill/SkillAdmin',
        SkillTreeTpl: '/resources/jquery-tmpl/jobs/tpl',
        ulImagesTmpl: '/resources/jquery-tmpl/ulImages',
        communityAuthorizationTmpl: '/resources/jquery-tmpl/communities/communityAuthorization',
        settingsDeniedTmpl: '/resources/jquery-tmpl/settings/settingsDenied',
        cartTmpl: '/resources/jquery-tmpl/products/cart',
        companyOrdersTmpl: '/resources/jquery-tmpl/products/companyOrders',
        orderTmpl: '/resources/jquery-tmpl/products/order',
        productsTmpl: '/resources/jquery-tmpl/products/products',
        textDiffTmpl: '/resources/jquery-tmpl/landmark/textDiff',
        configurationsForProductItemTmpl: '/resources/jquery-tmpl/products/configurationsForProductItem',
        resizeImagesTmpl: '/resources/jquery-tmpl/images/resizeImages',
        loadImagesCkTmpl: '/resources/jquery-tmpl/ckeditor/loadImages',
        wpPlayerTmpl: '/resources/jquery-tmpl/wpPlayer',
        newSectionFormTmpl: '/resources/jquery-tmpl/rm/sections/newSectionForm',

        // CSS
        //UICss: '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui',
        UICss: '/resources/javascript/jQuery-UI-1.10.3/jquery-ui',
        ytLoadCss: '/resources/styles/ytLoad.jquery',
        carouselCss: '/resources/styles/kdesign/jcarousel',
        toastmessageCss: '/resources/styles/kdesign/jquery.toastmessage-min',
        fancyboxCss: '/resources/javascript/fancybox-2.0/jquery.fancybox',
        bxSliderCss: '/resources/javascript/jquery.bxslider/jquery.bxslider',
        shadowboxCss: '/resources/javascript/shadowbox-3.0.3/shadowbox',
        alertsCss: '/resources/styles/kdesign/jquery.alerts',
        cuselCss: '/resources/styles/kdesign/cusel',
        wpHeaderPlacesCss: '/resources/styles/wp-actual-places',
        wpPopupCss: '/resources/styles/wp-popup',
        wpConfigurationProductsCss: '/resources/styles/kdesign/wp-configurations',
        wpImagesCss: '/resources/styles/kdesign/wp-images',
        wpPhotosCss: '/resources/styles/kdesign/wp-photos',
        wpPagesCss: '/resources/styles/wp-pages',
        columnPublicCss: '/resources/styles/wp-columns',
        filtersCss: '/resources/styles/filters',
        wpLogoCss: '/resources/styles/kdesign/wp-logo',
        kSelectboxCss: '/resources/styles/kdesign/selectbox',
        JcropCss: '/resources/javascript/jcrop/css/jquery.Jcrop',
        shareLikeCss: '/resources/styles/shareLike',
        shareLikeCss2: '/resources/styles/shareLike2',
        ckeditorCss: '/resources/javascript/ckeditor/sample',
        photoSocialGalleryCss: '/resources/styles/kdesign/photo-popup',
        wpDatepickCss: '/resources/javascript/jQuery.Datepick.Package-4.1.0/jquery.datepick',
        wpDatesCss: '/resources/styles/kdesign/wp-dates',
        sliderCss: '/resources/styles/slider',
        chosenCss: '/resources/styles/chosen/chosen.min',
        ulImagesCss: '/resources/styles/kdesign/ulImages',
        jspkgEmoticonsCss: '/resources/javascript/jspkg/stylesheets/jquery.cssemoticons',
        fullcalendarCss: '/resources/javascript/fullcalendar/fullcalendar',
        minicolorsCss: '/resources/styles/jquery.minicolors',
        wpPlayerCss: '/resources/styles/wp-player'
    },
    shim: {
        // MODULES
        authorization: {deps: ['toastmessage']},
        wall: {deps: ['toastmessage']},
        news: {deps: ['toastmessage']},
        diary: {deps: ['toastmessage', 'fullcalendar', 'APSchedulerParser', 'alerts', 'moment', 'text!eventsListTmpl.ftl', 'wpDates', 'tmpl']},
        circles: {deps: ['toastmessage']},
        subscriptions: {deps: ['toastmessage']},
        userSettings: {deps: ['toastmessage', 'FormParser']},
        albumsForOwner: {deps: ['toastmessage']},
        companiesForOwner: {deps: ['toastmessage']},
        communitiesForOwner: {deps: ['toastmessage']},
        reviewsForOwner: {deps: ['toastmessage', 'json']},
        reviewsForGuest: {deps: ['toastmessage']},
        messages: {deps: ['toastmessage', 'jqueryEmotions', 'resize', 'xml2json', 'shadowbox', 'wpAutocomplete', 'wpUsersSearchFinalValues', 'text!dialogsTmpl.ftl', 'text!wpAutocompleteTmpl.ftl', 'text!wpUsersSearchTmpl.ftl', 'tmpl']},
        posters: {deps: ['toastmessage']},
        arenas: {deps: ['toastmessage']}, 
        SkillAdmin: {deps: ['toastmessage',  'text!treeTpl_SkillAdmin.ftl', 'alerts']},
        slider: {deps: [ 'text!sliderCss.css']},
        resume: {deps: ['tmpl', 'slider', 'text!SkillTreeTpl.ftl']},
        job: {deps: ['toastmessage', 'alerts']},
        jobs: {deps: ['tmpl', 'alerts']}, 
        textDiff: {deps: ['jsdiff',  'text!textDiffTmpl.ftl']},
        
        // PLUGINS
        UI: {deps: ['text!UICss.css']},
        select2: {deps: ['text!select2Css.css']},
        ytLoad: {deps: ['text!ytLoadCss.css']},
        carousel: {deps: ['text!carouselCss.css']},
        bxSlider: {deps: ['text!bxSliderCss.css']},
        chosen: {deps: ['chosenJquery', 'text!chosenCss.css']},
        alerts: {deps: ['browser', 'text!alertsCss.css']},
        cusel: {deps: ['browser', 'text!cuselCss.css']},
        wpComments: {deps: ['tmpl', 'text!wpCommentsTmpl.ftl', 'autosize']},
        wpCirclesLine: {deps: ['tmpl', 'text!wpCirclesLineTmpl.ftl']},
        wpCirclesAndFriendsPopup: {deps: ['tmpl', 'text!wpCirclesAndFriendsPopupTmpl.ftl']},
        wpHeaderPlaces: {deps: ['text!wpHeaderPlacesCss.css', 'text!wpHeaderPlacesTmpl.ftl', 'tmpl', 'cookie', 'places', 'wpTogglePopup', 'tinyscrollbar']},
        maskInput: {deps: ['browser']},
        answers: {deps: ['tmpl', 'text!answersTmpl.ftl', 'migrate']},
        wpPopup: {deps: ['text!wpPopupCss.css', 'tmpl', 'text!wpPopupTmpl.ftl', 'tinyscrollbar', 'resize']},
        wpConfigurationProducts: {deps: ['text!wpConfigurationProductsCss.css', 'tmpl', 'text!wpConfigurationProductsTmpl.ftl']},
        Jcrop: {deps: ['text!JcropCss.css']},
        logo: {deps: ['fancybox', 'FileAPI', 'Jcrop', 'tmpl', 'text!logoTmpl.ftl']},
        wpLogo: {deps: ['text!wpLogoCss.css', 'FileAPI', 'text!wpLogoTmpl.ftl']},
        wpImages: {deps: ['text!wpImagesCss.css', 'tmpl', 'text!wpImagesTmpl.ftl', 'FileAPI']},
        wpPhotos: {deps: ['text!wpPhotosCss.css', 'tmpl', 'text!wpPhotosTmpl.ftl', 'FileAPI', 'UI']},
        wpPages: {deps: ['text!wpPagesCss.css', 'tmpl', 'text!wpPagesTmpl.ftl']},
        wpFiltersPublic: {deps: ['text!filtersCss.css', 'numberPublic', 'columnPublic', 'radioPublic', 'selectPublic', 'chosen', 'migrate', 'color', 'sizesPublic']},
        wpFiltersUser: {deps: ['text!filtersCss.css', 'numberUser', 'columnUser', 'radioUser', 'stringUser', 'chosen', 'text!chosenSelectTmpl.ftl', 'color', 'sizes']},
        numberPublic: {deps: ['UI', 'numberMask', 'tmpl', 'text!numberPublicTmpl.ftl']},
        columnPublic: {deps: ['tmpl', 'text!columnPublicTmpl.ftl', 'tinyscrollbar']},
        radioPublic: {deps: ['tmpl', 'text!radioPublicTmpl.ftl']},
        selectPublic: {deps: ['tmpl', 'text!selectPublicTmpl.ftl', 'tinyscrollbar']},
        numberUser: {deps: ['tmpl', 'text!numberUserTmpl.ftl', 'numberMask']},
        columnUser: {deps: ['tmpl', 'text!columnUserTmpl.ftl', 'tinyscrollbar']},
        radioUser: {deps: ['tmpl', 'text!radioUserTmpl.ftl']},
        stringUser: {deps: ['tmpl', 'text!stringUserTmpl.ftl']},
        color: {deps: ['tmpl', 'text!colorUserTmpl.ftl']},
        photoSocialGallery: {deps: ['text!photoSocialGalleryCss.css', 'tmpl', 'text!photoSocialGalleryTmpl.ftl', 'wpTogglePopup', 'migrate']},
        ckeditor: {deps: ['text!ckeditorCss.css', 'ckeditorAdapters', 'UlImages', 'resizeImages', 'text!loadImagesCkTmpl.ftl']},
        wpCatalog: {deps: ['tmpl', 'text!wpCatalogTmpl.ftl', 'chosen']},
        wpActualPlace: {deps: ['tmpl', 'text!wpActualPlaceTmpl.ftl', 'places', 'cusel']},
        //wpPlacesNew: {deps: ['tmpl', 'text!wpPlacesNewTmpl.ftl', 'places', 'chosen']},
        wpUsersSearchFinalValues: {deps: ['tmpl', 'text!wpUsersSearchFinalValuesTmpl.ftl']},
        wpPageSettings: {deps: ['tmpl', 'text!wpPageSettingsTmpl.ftl', 'wpTogglePopup']},
        wpDates: {deps: ['text!wpDatesCss.css', 'wpDatepickRu', 'tmpl', 'text!wpDatesTmpl.ftl']}, 
        wpPostersDates: {deps: ['tmpl', 'text!wpPostersDatesTmpl.ftl']}, 
        wpDatepick: {deps: ['text!wpDatepickCss.css', 'UI']}, 
        wpDatepickRu: {deps: ['wpDatepick']}, 
        wpHalls: {deps: ['text!wpHallsTmpl.ftl']},
        fullcalendar: {deps: ['text!fullcalendarCss.css', 'UI']},
        minicolors: {deps: ['text!minicolorsCss.css']},
        resizeImages: {deps: ['UI', 'tmpl', 'text!resizeImagesTmpl.ftl', 'numberMask']},
        tmpl: {init: function(){
            $.extend($.tmpl.tag, {
                "var": {
                    open: "var $1;"
                }
            });
        }},
        fancybox: {init: function(){
            /*$.fancybox({
                beforeClose: function(){
                    alert(1);
                }
            });*/
        },deps: ['text!fancyboxCss.css']},

        shadowbox: {init: function(){       
            Shadowbox.clearGallery = function(gallery) {
                var self = this;
                // Найдем все элементы галереи и удалим их
                for(var i in self.cache) {
                    if(self.cache[i].gallery === gallery) {
                        self.removeCache(self.cache[i].link);
                    }
                }
            };
        }, deps: ['text!shadowboxCss.css']},
        toastmessage: {init: function(){            
            // Настроим сообщения по умолчанию
            $().toastmessage({
                sticky: false,
                inEffectDuration: 300,
                stayTime: 5000,
                position : 'top-right',
                close: function () {
                    //
                }
            });
            
            // Сделаем поддержку старых сообщений
            window.errorMessage = function(error){
                error = error || "";
                if (!error.trim() || error.indexOf("<html") != -1 || error.indexOf("<body") != -1 || error.indexOf("<div") != -1) {
                    error = 'Произошла ошибка на сервере.';
                }
                error = error.split('\\nStackTrace')[0];
                $().toastmessage('showToast', {
                    text: error,
                    type: 'error'
                });
            };

            window.warningMessage = function(warning){
                warning = warning || "";
                if (!warning.trim() || warning.indexOf("<html") != -1 || warning.indexOf("<body") != -1 || warning.indexOf("<div") != -1) {
                    warning = 'Произошла ошибка на сервере.';
                }
                warning = warning.split('\\nStackTrace')[0];
                $().toastmessage('showToast', {
                    text: warning,
                    type: 'warning'
                });
            };

            window.successMessage = function(success){
                success = success || "";
                if (!success.trim() || success.indexOf("<html") != -1 || success.indexOf("<body") != -1 || success.indexOf("<div") != -1) {
                    success = 'Произошла ошибка на сервере.';
                }
                success = success.split('\\nStackTrace')[0];
                $().toastmessage('showToast', {
                    text: success,
                    type: 'success'
                });
            };
        }, deps: ['text!toastmessageCss.css']}
    },
    config: {
        text: {
            onXhrComplete: function (xhr, url) {
                if (url.indexOf(".ftl") !== -1) {
                    var jqueryTmplsHolder = document.getElementById('jqueryTmplsHolder');
                    if (!jqueryTmplsHolder) {
                        jqueryTmplsHolder = document.createElement('div');
                        jqueryTmplsHolder.id = 'jqueryTmplsHolder';
                        var body = document.getElementsByTagName('body')[0];
                        body.insertBefore(jqueryTmplsHolder, body.firstChild);
                    }
                    $(xhr.responseText).each(function() {
                        if (document.getElementById(this.id) === null) {
                            jqueryTmplsHolder.appendChild(this);
                        }
                    });
                } else if (url.indexOf(".css") !== -1 && document.getElementById(url) === null) {
                    var stylesHolder = document.getElementById('stylesHolder');
                    if (!stylesHolder) {
                        stylesHolder = document.createElement('div');
                        stylesHolder.id = 'stylesHolder';
                        var body = document.getElementsByTagName('body')[0];
                        body.insertBefore(stylesHolder, body.firstChild);
                    }
                    var style = document.createElement('style');
                    style.id = url;
                    style.innerHTML = xhr.responseText;
                    stylesHolder.appendChild(style);
                }                
            }
        }
    }
});

/************* CommonScripts **********************/

jQuery(function($) {

  var _oldShow = $.fn.show;

    $.fn.show = function(speed, oldCallback) {
        return $(this).each(function() {
            var obj         = $(this),
            newCallback = function() {
                if ($.isFunction(oldCallback)) {
                    oldCallback.apply(obj);
                }
                obj.trigger('afterShow');
            };

            // you can trigger a before show if you want
            obj.trigger('beforeShow');

            // now use the old function to show the element passing the new callback
            _oldShow.apply(obj, [speed, newCallback]);
        });
    }
});

$.fn.extend({
    onShowSelect: function(callback, unbind) {
        return this.each(function() {
            var obj = this,
                bindopt = (unbind === undefined) ? true : unbind;

            if($.isFunction(callback)) {
                if($(this).is(':hidden')) {
                    var checkVis = function() {
                        if($(obj).is(':visible')) {
                            callback.call();
                            if(bindopt) {
                              $('body').unbind('click keyup keydown', checkVis);
                            }
                        }                         
                    };
                    $('body').bind('click keyup keydown', checkVis);
                }
                else{
                  callback.call();
                }
            }
        });
    }
});

var youtube_api_tag = document.createElement('script');

youtube_api_tag.src = "https://www.youtube.com/iframe_api";
var firstScriptYoutubeApiTag = document.getElementsByTagName('script')[0];
firstScriptYoutubeApiTag.parentNode.insertBefore(youtube_api_tag, firstScriptYoutubeApiTag);
var landmark = false;


function clone(obj) {
    if(obj === null || typeof(obj) !== 'object')
        return obj;
    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

function get_form_elements(form_name) {
    var form = document.getElementById(form_name);
    var elements = [];
    var current_el;
    var radio_groups = {}; // Эта переменная служит для учета групп радиокнопок
    for (var i=0; i<form.length; i++) {
        var temp_el = form[i];
            if(temp_el.type !== undefined) {

            switch(temp_el.type) {
                case "radio" :
                if (temp_el.checked) {
                    radio_groups[temp_el.name] = '[filled]'; // помечаем группу
                    current_el = {name: temp_el.name, type: 'radio', value: temp_el.value};
                    elements.push(current_el);
                }
                else {
                    if (!radio_groups[temp_el.name]) { // если группа еще не встречалась
                        radio_groups[temp_el.name] = '[no elelements checked]';
                    }
                    continue;
                }
                break;
                case 'checkbox' :
                if (temp_el.checked) {
                    current_el = {name: temp_el.name, type: 'checkbox', value: temp_el.value};
                }
                else {
                    current_el = {name: temp_el.name, type: 'checkbox', value: '[not checked]'};
                }
                elements.push(current_el);
                break;
                case 'text' :
                current_el = {name: temp_el.name,  type:temp_el.type, value: temp_el.value};
                elements.push(current_el);
                break;
                case 'select-one' :
                current_el = {name: temp_el.name,  type:temp_el.type, value: temp_el.value};
                elements.push(current_el);
                break;
                case 'textarea' :
                current_el = {name: temp_el.name,  type:temp_el.type, value: temp_el.value};
                elements.push(current_el);
                break;
                case 'file':break;
                case 'hidden' :
                current_el = {name: temp_el.name,  type:temp_el.type, value: temp_el.value};
                elements.push(current_el);
                break;
                case 'submit':break;
                default:break;
            }
        }
    }
    return elements;
}

//Конвертации времени(в unixtime) в удобочитаемы вид
function convertDate(time){
    var timeDate = new Date();
    timeDate.setTime(time);
    
    var currentDate = new Date();
    var elapsedSeconds = Math.floor((currentDate.getTime() - time) / 1000);
    if (elapsedSeconds <= 3600 * 3) {
        if (elapsedSeconds < 60) {//Менее минуты назад
            return "менее минуты назад";
        }
    
        var timeText ="";
        var elapsedHour = Math.floor(elapsedSeconds / 3600);
        var elapsedMinutes = Math.floor(elapsedSeconds / 60) - (elapsedHour * 60);
        var lastMinutesDigit = elapsedMinutes % 10;
        var lastHourDigit = elapsedHour % 10;
        
        if (elapsedHour !== 0) {//Более часа назад
            timeText = elapsedHour;
            if (lastHourDigit === 1) {
                timeText += " час";
            } else if (lastHourDigit >= 2 && lastHourDigit <= 4) {
                timeText += " часа";
            } else {
                timeText += " часов";
            }
            if (lastMinutesDigit > 0) {
                timeText += " ";
            }
        }

        if (elapsedMinutes > 0) {
            timeText += '' + elapsedMinutes;
            if (lastMinutesDigit === 1) {
                timeText += " минуту";
            } else if (lastMinutesDigit >= 2 && lastMinutesDigit <= 4) {
                timeText += " минуты";
            } else {
                timeText += " минут";
            }
        }
        timeText += " назад";
        return timeText;
    }
    
    var monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
                    "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    //Сколько дней прошло
    var elapsedDay = Number.MAX_VALUE;
    for (var i = 0; i < 5; i++) {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setTime(date.getTime() -24 * i * 3600 * 1000); 
        if (time > date.getTime()) {
            elapsedDay = i;
            break;
        }
    }
    var timeText = "";
    if (elapsedDay === 0) {
        timeText = "сегодня";
    } else if (elapsedDay === 1) {
        timeText = "вчера";
    } else {
        timeText = '' + timeDate.getDate() +' ';
        timeText+= monthNames[timeDate.getMonth()];
    }
    
    //Добавляем время
    var hours = timeDate.getHours();
    var minutes = timeDate.getMinutes();
    timeText += " в ";
    if (hours > 9)
        timeText += hours;
    else
        timeText += "0" + hours;
    timeText += ":";
    if (minutes > 9)
        timeText += minutes;
    else
        timeText += "0" + minutes;
    return timeText;
}

function toIndicateMainUserFields(){
    
}
// Исключения 
function Exception(message) {
    this.message = message;
    console.error(message);
}
    
function getPlacesData(place_id){

    var places_data = {
            'regions': [],
            'currentPlaceId': place_id
        },
        city_id,
        region_id,
        region,
        city;

    for(var key in wpPlaces.parents[0]){
        for(var key2 in wpPlaces.parents[wpPlaces.parents[0][key]]){
            region_id = wpPlaces.parents[wpPlaces.parents[0][key]][key2];
            region = wpPlaces.values[region_id];
            region['cities'] = [];
            for(var key3 in wpPlaces.parents[region_id]){
                city_id = wpPlaces.parents[region_id][key3];
                city = wpPlaces.values[city_id];
                city['id'] = city_id;
                region.cities.push(city);
            }
            places_data['regions'].push(region);
        }
    }

    return places_data;
}

function initializePlacesFromCookiePopup(place_id){

    var places_data = getPlacesData(0);

    places_data['selectedPlaceTitle'] = place_id > 0 ? wpPlaces.values[place_id].value : '';

    var content = $('#wpPlacesFromCookie').tmpl(places_data);

    $.fancybox({
        content: content,
        closeBtn: false,
        modal: true,
        fitToView: false,
        afterShow: function(){
            $('select', this.content).chosen({
                width: "100%"
            });

            this.content.off('click.close_form').on('click.close_form', '[data-btn="yes"]', function(){
                updateUserLocation(place_id);
            });

            this.content.off('click.selected_location').on('click.selected_location', '[data-btn="no"]', function(){
                $(this).parents('[data-holder="askYourLocation"]:first').hide();
                $('[data-holder="selectYourCity"]', this.content).show();
            });

            this.content.off('click.save_location').on('click.save_location', '[data-btn="save_location"]', function(){
                var selected_location_id = parseInt($('select', this.content).val());
                updateUserLocation(selected_location_id);
            });
        }
    });

}

function updateUserLocation(location_id){

    if(location_id <= 0){
        warningMessage('Вы не указали город');
        return;
    }

    $.fancybox.close();

    $.ajax({
        url: base_url + '/' + location_id + '/update_user_location',
        dataType: 'json',
        type: 'POST',
        success: function () {},
        error: function(xhr, status) {
            errorMessage(xhr.responseText);
        }
    });

}

function initializeNewWpPlaces(place_id, holder){

    var places_data = getPlacesData(place_id);

    $('#wpPlacesNew').tmpl(places_data).appendTo(holder).chosen({
        width: "100%"
    });
        
    
}

function setNavCurrentElement(controllerType, nodeType) {
    $(".main-nav .nav-icon").removeClass("current");
    $("." + controllerType + "-ico").closest("a").addClass("current");
}

function applyResizeForMessageCenter() {
    $(window).resize(function() {
        
        $('section.content-box').css('height', 'auto');
        
        if(getDocumentHeight()) {
            $('.content-box').height(getDocumentHeight()-6);
        }
        else if(getViewportHeight(isOpera, isIE)) {
            $('.content-box').height(getViewportHeight(isOpera, isIE)-6);
        }
    });
};
function declension(num, expressions) {
    var result;
    var count = num % 100;
    if (count >= 5 && count <= 20) {
        result = expressions['2'];
    } else {
        count = count % 10;
        if (count == 1) {
            result = expressions['0'];
        } else if (count >= 2 && count <= 4) {
            result = expressions['1'];
        } else {
            result = expressions['2'];
        }
    }
    return result;
}
var xhr;// нужен для сброса ajax запроса
var ajaxRedirect = function(href) {
    location.href = href;
};
var colorCode = {
    "Белый": "#ffffff",
    "Бежевый": "#F5F5DC",
    "Желтый": "#FFFF00",
    "Оранжевый": "#FFA500",
    "Красный": "#FF0000",
    "Коричневый": "#A52A2A",
    "Розовый": "#FF69B4",
    "Фиолетовый": "#A020F0",
    "Зеленый": "#00FF00",
    "Голубой": "#00BFFF",
    "Синий": "#0000FF",
    "Серый": "#BEBEBE",
    "Черный": "#000000"
};
function getDocumentHeight() {
    return Math.max(document.compatMode != 'CSS1Compat' ? document.body.scrollHeight : document.documentElement.scrollHeight, getViewportHeight());
}

function getViewportHeight(isOpera, isIE) {
    return ((document.compatMode || isIE) && !isOpera) ? (document.compatMode == 'CSS1Compat') ? document.documentElement.clientHeight : document.body.clientHeight : (document.parentWindow || document.defaultView).innerHeight;
}

var ua = navigator.userAgent.toLowerCase();
var isOpera = (ua.indexOf('opera')  > -1);
var isIE = (!isOpera && ua.indexOf('msie') > -1);

function initCometSever() {

    CometServer().start();

    CometServer().subscription("msg.new_message", function(e) {

        var data = JSON.parse(e.data);
        
        if(data.node_id_to && data.node_id_to==wpUser.node_id) {
            
            var date = new Date(data.created_date);

            var date_time = date.getDate()<10 ? '0'+date.getDate() :date.getDate();
                date_time += (date.getMonth()+1)<10 ? '.0'+(date.getMonth()+1) : '.'+(date.getMonth()+1);
                date_time += '.'+date.getFullYear();
                date_time +=  ", в ";
                date_time +=  date.getHours()<10 ?'0'+date.getHours() : date.getHours();
                date_time += ":";
                date_time += date.getMinutes()<10 ?'0'+date.getMinutes() : date.getMinutes();

            if($('.dialog-block-class[data-id="'+data.dialog_id+'"]').size()>0) {
                $('#dialogBlockMessageTmpl').tmpl({
                    id: data.id,
                    value: data.value,
                    message: data.message.replace(/\r\n/g, "<br>").replace(/\r/g, "<br>").replace(/\n/g, "<br>"),
                    time: convertDate(data.created_date),
                    user: data.user,
                    prefix: base_url
                }, {
                    format_date: function (value) {
                        var date = new Date(value);

                        var date_time = date.getDate()<10 ? '0'+date.getDate() :date.getDate();
                            date_time += (date.getMonth()+1)<10 ? '.0'+(date.getMonth()+1) : '.'+(date.getMonth()+1);
                            date_time += '.'+date.getFullYear();
                            date_time += ", в ";
                            date_time += date.getHours()<10 ?'0'+date.getHours() : date.getHours();
                            date_time += ":";
                            date_time += date.getMinutes()<10 ?'0'+date.getMinutes() : date.getMinutes();

                        return convertDate(value);
                    }
                }).appendTo($('.dialog-block-class[data-id="'+data.dialog_id+'"] .dialog-block-messages-list'));
            }

            // -------

            var unreaded_messages = 0;

            if(window.localStorage['unreaded_messages']!=undefined) {
                unreaded_messages = parseInt(window.localStorage['unreaded_messages']);
            }

            if(CometServer().isMaster()) {
                unreaded_messages++;
            }

            window.localStorage['unreaded_messages'] = unreaded_messages;

            $('.new-message-ico').attr('title', 'Есть новые сообщения ('+window.localStorage['unreaded_messages']+')').fadeIn('200');

            // -------

            console.log("message is:", data);
        }
    });

    if(window.localStorage['unreaded_messages']!=undefined && parseInt(window.localStorage['unreaded_messages'])>0) {
        $('.new-message-ico').attr('title', 'Есть новые сообщения ('+window.localStorage['unreaded_messages']+')').fadeIn('200');
    }

    /*$('div.left-column div.user-box').height(getPageBiggerColumnsHeight()+21);
    $('div.central-column-content').height(getPageBiggerColumnsHeight());
    $('div.right-column div.text-box').height(getPageBiggerColumnsHeight()+52);

    $('.central-column-inside, .left-column-inside, .right-column-inside').resize(function() {
        $('div.left-column div.user-box').height(getPageBiggerColumnsHeight()+21);
        $('div.central-column-content').height(getPageBiggerColumnsHeight());
        $('div.right-column div.text-box').height(getPageBiggerColumnsHeight()+52);
    });*/
}
function sendMessageToWp() {

    $('#send_message_to_wp').fancybox({
        content: $('#send_message_to_wp_controls_holder'),
        closeBtn: false,
        modal: true
    });

    $('#send_message_to_wp_controls_holder').off('click.ask_questions').on('click.ask_questions', '[data_btn="send_message"]', function(){

        var send_data = {},
            is_return = false;

        $('#send_message_to_wp_controls_holder [data-form]').each(function(){
            if($.trim($(this).val()) === '') {
                errorMessage('Вы заполнили не все поля');
                is_return = true;
                return false;
            }
            send_data[$(this).data('form')] = $(this).val();
        });

        if(is_return){
            return;
        }

        $.ajax({
            url: base_url+'/to_ask_questions_for_wp',
            data: send_data,
            dataType: 'json',
            type: 'POST',
            success: function () {
                successMessage('Сообщение успешно отправлено.');
                $.fancybox.close();
            },
            error: function(xhr, status) {
                errorMessage(xhr.responseText);
            }
        });
    });

    $('#send_message_to_wp_controls_holder').off('click.close_form_to_ask_question').on('click.close_form_to_ask_question', '[data_btn="close_form"]', function(){
        $.fancybox.close();
    });
}

function applyFieldsHash(holder_object, input_hash_object){
    
    var value_fileds,
        values_fileds = '';
    
        
    holder_object.find('[data-form]').each(function(){
        value_fileds = null;
        switch($(this).data('form')){
            case 'logo_id':
                value_fileds = 0;
                var logo = $(this).wpLogo('option', 'logo');

                if(logo !== null && 'id' in logo){
                    value_fileds = logo.id;
                }
                break;
            case 'section_id':
                value_fileds = parseInt($(this).wpCatalog('option', 'currentCatalogId'));
                break;
            case 'location_id':
                value_fileds = parseInt($(this).find('select:first').val());
                break;
            case 'description':
                value_fileds = $.trim($(this).val());
                break;
            default:
                value_fileds = $(this).val();
                break;
        }
        
        if(value_fileds === null || value_fileds === '' || value_fileds === 0 || value_fileds === '0'){
            return true;
        }
        
        value_fileds += '';
        values_fileds += value_fileds;
        
    });
    
    input_hash_object.val(getHash(values_fileds));
    
}

function getHash(str){
    
    var hash = 0, i, char, l;
    if (str.length === 0) return hash;
    
    for (i = 0, l = str.length; i < l; i++) {
        char  = str.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; 
    }
    return hash;
    
}

function getMinImageTypeBySizes(image_width, image_height){

    if('small' in imageSizes && imageSizes.small.width >= image_width && imageSizes.small.height >= image_height){
        return 'small';
    }
    else if('preview' in imageSizes && imageSizes.preview.width >= image_width && imageSizes.preview.height >= image_height){
        return 'preview';
    }
    else if('med' in imageSizes && imageSizes.med.width >= image_width && imageSizes.med.height >= image_height){
        return 'med';
    }
    else if('max' in imageSizes && imageSizes.max.width >= image_width && imageSizes.max.height >= image_height){
        return 'max';
    }
    else{
        if('original' in imageSizes){
            return 'original';
        }
        return null
    }

}

/************ Глобальные события  *****************************/

// события для wp_checkbox
$(document).off('click.default_checkbox').on('click.default_checkbox', '[data-checkbox="simple"]', function(){

    if($(this).hasClass('checkbox')){
        $(this).toggleClass('checkbox-active');
        return false;
    }

    $(this).parents('.checkbox:first').toggleClass('checkbox-active');

});

// события для wp_radio
$(document).off('click.default_radio').on('click.default_radio', '.radio-item [class^=radio], .radio-item .label', function(){
    // Снимаем выделение со всех радиобатонов внутри холдера
    $(this).parents('.radio-item:first').parent().find('[class^=radio]').removeClass('radio-checked').addClass('radio-empty');
    // Переключаем радио кнопку
    $(this).parent().find('[class^=radio]:first').removeClass('radio-empty').addClass('radio-checked');
});
