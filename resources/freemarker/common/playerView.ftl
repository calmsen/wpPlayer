<#include "../kdesign/globalDeclares.ftl"/>
<#include "../kdesign/common/globalJsVars.ftl">
<#include "../kdesign/common/scripts.ftl">
<div id="audio-album-tracks-wraper" style="margin: 0 auto; width: 518px;">
    
</div>
<#noescape>
<script type="text/javascript">
    require(["wpPlayer"], function(wpPlayer) {
        wpPlayer.init({
            tracks: ${json_encode(tracks)}
            , playlists: ${json_encode(playlists)}
        });
    });
</script>
</#noescape>