package mainproject.musicforecast.domain.playlist.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import mainproject.musicforecast.domain.playlistLike.entity.PlaylistLike;
import mainproject.musicforecast.domain.playlistTag.entity.PlaylistTag;
import mainproject.musicforecast.domain.tag.entity.Tag;

import java.util.List;

public class PlaylistDto {

    @Getter
    @Setter
    public static class Post {
        private long memberId;
        private String title;
        private boolean isPublic;
    }

    @Getter
    @Setter
    public static class Patch {
        private long playlistId;
        private String title;
        private boolean isPublic;
        private List<PlaylistTag> playlistTags;
    }

    /*
    * 좋아요 누를 때 보내는 값
    */
    @Getter
    public static class Like {
        private long memberId;
    }
    
    /*
    * 플레이리스트 목록에서 조회시
    */
    @Builder
    @Getter @Setter
    public static class Response {
        private long playlistId;
        private String title;
        private long memberId;
    }

    /*
     * 플레이리스트 개별 조회시
     */
    @Builder
    @Getter @Setter
    public static class DetailResponse {
        private long playlistId;
        private String title;
        private boolean isPublic;
        private int view;
        private long memberId;
        private List<PlaylistTagResponse> playlistTags;
    }

    @Builder
    @Getter @Setter
    public static class PlaylistTagResponse {
        private long playlistTagId;
        private long playlistId;
        private long tagId;
    }

}