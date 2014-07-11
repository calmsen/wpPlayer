package com.wp.web.controllers;

import com.wp.utils.Cast;
import com.wp.web.exceptions.BadRequestException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Ruslan Rakhmankulov
 */
@Controller
public class PlaylistController extends AController {
    static class Track {
        private long track_id = 1;
        private long object_id = 1; // тоже самое что и track_id
        private long album_id = 0;
        private String perfomer_name = "исполнитель 1";
        private String track_title = "трек 1";
        private String track_duration = "00:03";
        private boolean track_content_exist = true;
        private String track_video = "qwrqtwt";
        private long like_id = 0;
        private long user_id = 0; // аналог sign
        private String src = "/resources/audios/mp3/3106152089aa290c1b.mp3";
        private String track_content = "Текст песни";

        public Track() {
        }
        
        public long getTrack_id() {
            return track_id;
        }

        public void setTrack_id(long track_id) {
            this.track_id = track_id;
        }

        public long getObject_id() {
            return object_id;
        }

        public void setObject_id(long object_id) {
            this.object_id = object_id;
        }
        
        public long getAlbum_id() {
            return album_id;
        }

        public void setAlbum_id(long album_id) {
            this.album_id = album_id;
        }

        public String getPerfomer_name() {
            return perfomer_name;
        }

        public void setPerfomer_name(String perfomer_name) {
            this.perfomer_name = perfomer_name;
        }

        public String getTrack_title() {
            return track_title;
        }

        public void setTrack_title(String track_title) {
            this.track_title = track_title;
        }

        public String getTrack_duration() {
            return track_duration;
        }

        public void setTrack_duration(String track_duration) {
            this.track_duration = track_duration;
        }

        public boolean isTrack_content_exist() {
            return track_content_exist;
        }

        public void setTrack_content_exist(boolean track_content_exist) {
            this.track_content_exist = track_content_exist;
        }

        public String getTrack_video() {
            return track_video;
        }

        public void setTrack_video(String track_video) {
            this.track_video = track_video;
        }

        public long getLike_id() {
            return like_id;
        }

        public void setLike_id(long like_id) {
            this.like_id = like_id;
        }

        public long getUser_id() {
            return user_id;
        }

        public void setUser_id(long user_id) {
            this.user_id = user_id;
        }
        
        public String getSrc() {
            return src;
        }

        public void setSrc(String src) {
            this.src = src;
        }

        public String getTrack_content() {
            return track_content;
        }

        public void setTrack_content(String track_content) {
            this.track_content = track_content;
        }
        
        
    }
    static  class Playlist {
        private long id = 0l;
        private List<Track> playlist = new ArrayList<>();
        private int active =  0; // активный плейлист(например тот который редактируется или просматривается в плейлист баре)
        private long playing = 0l; // плейлист тот который играет (необязательно соответсвует плейлисту active )
        private String title = "Мой плейлист";
        // есть несколько видов плейлистов native, container, favorite_tracks и last_tracks. Native - это тот который в действительности есть в бд; container - 
        // это плейлист созданный из треков страницы. favorite_tracks - самые интересные треки, last_tracks - самые последние.
        private String type = "native"; // тип плейлиста
        private long user_id; // владелец плейлиста(аналон sign)
        private long my_id; // сессионный пользователь(аналон user.id)
        private long perfomer_id; // исполнитель. Значение не пустое тогда когда владелец является исполнителем
        private long community_id; // сообщество. Значение не пустое тогда когда владелец является владельцем или админом сообщества

        public Playlist() {
        }
        
        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public List<Track> getPlaylist() {
            return playlist;
        }

        public void setPlaylist(List<Track> playlist) {
            this.playlist = playlist;
        }

        public int getActive() {
            return active;
        }

        public void setActive(int active) {
            this.active = active;
        }

        public long getPlaying() {
            return playing;
        }

        public void setPlaying(long playing) {
            this.playing = playing;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public long getUser_id() {
            return user_id;
        }

        public void setUser_id(long user_id) {
            this.user_id = user_id;
        }

        public long getMy_id() {
            return my_id;
        }

        public void setMy_id(long my_id) {
            this.my_id = my_id;
        }

        public long getPerfomer_id() {
            return perfomer_id;
        }

        public void setPerfomer_id(long perfomer_id) {
            this.perfomer_id = perfomer_id;
        }

        public long getCommunity_id() {
            return community_id;
        }

        public void setCommunity_id(long community_id) {
            this.community_id = community_id;
        }
        
    }
    
    private List<Track> tracks = new ArrayList<>();
    private long trackIdCounter = 0l; 
    private void fillTracks() {
        if (tracks.isEmpty()) {
            while(tracks.size() <= 10) {
                Track track = new Track();
                track.setTrack_id(++trackIdCounter);
                track.setObject_id(trackIdCounter);
                track.setTrack_title("трек " + trackIdCounter);
                tracks.add(track);
            }
        }
    }
    private Track findTrackById(long track_id) {
        Track track = null;
        for (Track t: tracks) {
            if (t.getTrack_id()== track_id) {
                track = t;
            }
        }
        return track;
    }
    private List<Playlist> playlists = new ArrayList<>();
    private long playlistIdCounter = 0l; 
    
    private Playlist findPlaylistById(long playlist_id) {
        Playlist playlist = null;
        for (Playlist p: playlists) {
            if (p.getId() == playlist_id) {
                playlist = p;
            }
        }
        return playlist;
    }
    
    @RequestMapping(value = "/playlist/track/{track_id}", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> addTrack(ModelMap model, HttpServletRequest request, @PathVariable String track_id) {
        long playlist_id = Cast.toLong(request.getParameter("playlist_id"));
        Playlist playlist = null;
        boolean playlist_is_created = false;
        if (playlist_id <= 0) {
            playlist = new Playlist();
            playlist.setId(++playlistIdCounter);
            playlist.setUser_id(user.getId());
            playlist.setMy_id(user.getId());
            playlist.setPerfomer_id(user.getId());
            playlist.setActive(1);
            playlists.add(playlist);
            playlist_is_created = true;
        } else {
            playlist = findPlaylistById(playlist_id);
        }
        // добавим трек в плейлист
        Track track = findTrackById(Cast.toLong(track_id));
        playlist.getPlaylist().add(track);
        Map<String, Object> data = new HashMap<>();
        data.put("playlist_id", playlist.getId());
        data.put("track_info", track);
        data.put("playlist_is_created", playlist_is_created);
        return data;
    }
    
    @RequestMapping(value = "/playlist/track/{track_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public Map<String, Object> deleteTrack(ModelMap model, HttpServletRequest request, @PathVariable String track_id) {
        long playlist_id = Cast.toLong(request.getParameter("playlist_id"));
        
        if (playlist_id <= 0) {
            throw new BadRequestException();
        }
        Playlist playlist = findPlaylistById(playlist_id);
        if (playlist == null) {
            throw new BadRequestException();
        }
        // удалим трек из плейлиста
        for (Track track: playlist.getPlaylist()) {
            if (track.getTrack_id() == Cast.toLong(track_id)) {
                playlist.getPlaylist().remove(track);
                break;
            }
        }
        
        Map<String, Object> data = new HashMap<>();
        return data;
    }
    
    @RequestMapping(value = "/playlist", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> addPlaylist(ModelMap model, HttpServletRequest request) {
        
        Playlist playlist = new Playlist();
        playlist.setId(++playlistIdCounter);
        playlist.setTitle(request.getParameter("playlist_title"));
        playlist.setUser_id(user.getId());
        playlist.setMy_id(user.getId());
        playlist.setPerfomer_id(user.getId());
        playlists.add(playlist);
        Map<String, Object> data = new HashMap<>();
        data.put("playlist_info", playlist);
        return data;
    }
    
    @RequestMapping(value = "/playlist/{playlist_id}", method = RequestMethod.DELETE)
    @ResponseBody
    public Map<String, Object> deletePlaylist(ModelMap model, HttpServletRequest request, @PathVariable String playlist_id) {
        for (Playlist playlist: playlists) {
            if (playlist.getId() == Cast.toLong(playlist_id)) {
                playlists.remove(playlist);
                break;
            }
        }
        
        Map<String, Object> data = new HashMap<>();
        return data;
    }
    
    @RequestMapping(value = "/playlist/{playlist_id}", method = RequestMethod.PUT)
    @ResponseBody
    public Map<String, Object> editPlaylist(ModelMap model, HttpServletRequest request, @PathVariable String playlist_id) {
        Playlist playlist = findPlaylistById(Cast.toLong(playlist_id));
        playlist.setTitle(request.getParameter("playlist_title"));
        // TODO: сделать сортировку по track_positions[]
        Map<String, Object> data = new HashMap<>();
        data.put("playlist_info", playlist);
        return data;
    }
    
    @RequestMapping(value = "/playlist/{playlist_id}/activate", method = RequestMethod.PUT)
    @ResponseBody
    public Map<String, Object> activatePlaylist(ModelMap model, HttpServletRequest request, @PathVariable String playlist_id) {
        // деактивируем старый плейлист
        for (Playlist p: playlists) {
            if (p.getUser_id() == user.getId() && p.getActive() == 1) {
                p.setActive(0);
                break;
            }
        }
        Playlist playlist = findPlaylistById(Cast.toLong(playlist_id));
        playlist.setActive(1);
        Map<String, Object> data = new HashMap<>();
        return data;
    }
    
    @RequestMapping(value = "/track/{track_id}/content", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getTrackContent(ModelMap model, HttpServletRequest request, @PathVariable String track_id) {
        
        Track track = findTrackById(Cast.toLong(track_id));
        
        Map<String, Object> data = new HashMap<>();
        data.put("track_content", track.getTrack_content());
        return data;
    }
    
    @RequestMapping(value = "/tracks/last", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getLastTracks(ModelMap model, HttpServletRequest request) {        
        Map<String, Object> data = new HashMap<>();
        data.put("last_tracks", tracks);
        return data;
    }
    
    @RequestMapping(value = "/tracks/favorite", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getFavoriteTracks(ModelMap model, HttpServletRequest request) {        
        Map<String, Object> data = new HashMap<>();
        data.put("favorite_tracks", tracks);
        return data;
    }
    
    @RequestMapping(value = "/track/{track_id}/preview", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> addTrackPreview(ModelMap model, HttpServletRequest request, @PathVariable String track_id) {        
        Map<String, Object> data = new HashMap<>();
        return data;
    }
    
    @RequestMapping(value = "/playerView", method = RequestMethod.GET )
    public String getPlayerView(ModelMap model, HttpServletRequest request) {
        fillTracks();
        model.put("tracks", tracks);
        model.put("playlists", playlists);
        return "common/playerView";
    }
}
