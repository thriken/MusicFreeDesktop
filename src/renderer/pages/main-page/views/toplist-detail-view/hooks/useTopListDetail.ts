import { RequestStateCode } from "@/common/constant";
import { callPluginDelegateMethod } from "@/renderer/core/plugin-delegate";
import { useEffect, useRef, useState } from "react";

export default function useTopListDetail(
  topListItem: IMusic.IMusicSheetItem | null,
  platform: string
) {
  const [mergedTopListItem, setMergedTopListItem] =
    useState<ICommon.WithMusicList<IMusic.IMusicSheetItem> | null>(topListItem);
  const pageRef = useRef(1);
  const [requestState, setRequestState] = useState(RequestStateCode.IDLE);

  async function loadMore(){
    if (!topListItem) {
      return;
    }
    try {
      if (pageRef.current === 1) {
        setRequestState(RequestStateCode.PENDING_FIRST_PAGE);
      } else {
        setRequestState(RequestStateCode.PENDING_REST_PAGE);
      }
      const result = await callPluginDelegateMethod({platform}, "getTopListDetail", topListItem, pageRef.current);
      if (!result) {
        throw new Error();
      }
      const currentPage = pageRef.current;
      setMergedTopListItem((prev) => ({
        ...prev,
        ...(result.topListItem),
        musicList: currentPage === 1 ? (result.musicList ?? []): [...prev.musicList, ...result.musicList]
      }))

      if (!result.isEnd) {
        setRequestState(RequestStateCode.IDLE);
      } else {
        setRequestState(RequestStateCode.FINISHED);
      }
      pageRef.current++;
    } catch {
      setRequestState(RequestStateCode.FINISHED);
    }
  }

  useEffect(() => {
    if (topListItem === null) {
      return;
    }
    loadMore();
  }, []);
  return [mergedTopListItem, requestState, loadMore] as const;
}
