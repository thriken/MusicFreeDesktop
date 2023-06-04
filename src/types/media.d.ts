declare namespace IMedia {
    export type SupportMediaItem = {
        music: IMusic.IMusicItem;
        album: IAlbum.IAlbumItem;
        artist: IArtist.IArtistItem;
    };

    export type SupportMediaType = keyof SupportMediaItem;


    interface IUnique {
        /** 唯一id */
        id: string;
        $?: any;
        [k: string | number | symbol]: any;
    }

    /** 基础媒体类型 */
    interface IMediaBase extends IUnique{
        /** 媒体来源平台，如本地等 */
        platform: string;
        [k: string | number | symbol]: any;
    }
}

declare namespace IMusic {
    interface IMusicSource {
        /** 播放的http请求头 */
        headers?: Record<string, string>;
        /** 兜底播放 */
        url?: string;
        /** UA */
        userAgent?: string;
    }

    interface IMusicItem extends IMedia.IMediaBase {
         /** 作者 */
         artist: string;
         /** 歌曲标题 */
         title: string;
         /** 时长(s) */
         duration: number;
         /** 专辑名 */
         album: string;
         /** 专辑封面图 */
         artwork: string;
         /** 默认音源 */
         url: string;
         // todo: 格式化
         /** 歌词URL */
         lrc: string;
         /** 歌词文本 */
         rawLrc: string;
         // 其他
        [k: string | number | symbol]: any;
    }

    interface IMusicSheetItem extends IMedia.IMediaBase {
        /** 封面图 */
        artwork?: string;
        /** 标题 */
        title: string;
        /** 描述 */
        description?: string;
        /** 作品总数 */
        worksNum?: number;
        /** 播放次数 */
        playCount?: number;
        /** 播放列表 */
        musicList?: IMusicItem[];
        /** 歌单创建日期 */
        createAt?: number;
        // 歌单作者
        artist?: string;
    }


    /** 歌单集合 */
    export interface IMusicSheetGroupItem {
        title?: string;
        data: Array<IMusicSheetItem>;
    }

    // 音质
    export type IQualityKey = 'low' | 'standard' | 'high' | 'super';
 
    type IMusicItemPartial = Partial<IMusicItem>;
}


declare namespace IAlbum {
    interface IAlbumItem extends IMedia.IMediaBase {
        artwork?: string;
        title: string;
        date?: string;
        artist?: string;
        description: string;
        /** 专辑内有多少作品 */
        worksNum?: number;
        musicList?: IMusic.IMusicItem[];
    }

}


declare namespace IArtist {
    interface IArtistItem {
        name: string;
        id: string;
        fans?: number;
        description?: string;
        platform: string;
        avatar: string;
        musicList?: IMusic.IMusicItem[];
        albumList?: IAlbum.IAlbumItem[]
    }

    type ArtistMediaType = 'music' | 'album'
}


declare namespace ILyric {
    interface ILyricSource  {
        lrc?: string;
        rawLrc?: string;
    }

    interface IParsedLrcItem {
        /** 时间 s */
        time: number;
        /** 歌词 */
        lrc: string;
    }

    export type IParsedLrc = IParsedLrcItem[];
}