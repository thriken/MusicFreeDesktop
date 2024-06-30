import { useState } from "react";
import SvgAsset from "@/renderer/components/SvgAsset";
import { PlayerState } from "@/renderer/core/track-player/enum";
import albumImg from "@/assets/imgs/album-cover.jpg";

import "./index.scss";
import {
  PlayerSyncStore,
  sendCommand,
} from "@/shared/player-command-sync/renderer";
import { useTranslation } from "react-i18next";
import { ipcRendererSend } from "@/shared/ipc/renderer";
import { useUserPreference } from "@/renderer/utils/user-perference";

const { currentMusicItemStore, playerStateStore, currentLyricStore } =
  PlayerSyncStore;

export default function MinimodePage() {
  const [hover, setHover] = useState(false);
  const currentMusicItem = currentMusicItemStore.useValue();
  const playerState = playerStateStore.useValue();
  const lyricItem = currentLyricStore.useValue();

  const { t } = useTranslation();
  const [showTranslation] = useUserPreference("showTranslation");

  const textContent = (
    <div className="text-container">
      <span>
        {lyricItem?.lrc || currentMusicItem?.title || t("media.unknown_title")}
      </span>
      {showTranslation ? <span>{lyricItem?.translation}</span> : null}
    </div>
  );

  const options = (
    <div className="options-container">
      <div
        role="button"
        className="close-button"
        onClick={() => {
          ipcRendererSend("set-minimode", false);
          ipcRendererSend("show-mainwindow");
        }}
      >
        <SvgAsset iconName="x-mark"></SvgAsset>
      </div>
      <div
        role="button"
        className="option-item"
        onClick={() => {
          sendCommand("SkipToPrevious");
        }}
      >
        <SvgAsset iconName="skip-left"></SvgAsset>
      </div>
      <div
        role="button"
        className="option-item"
        onClick={() => {
          sendCommand(
            "SetPlayerState",
            playerState === PlayerState.Playing
              ? PlayerState.Paused
              : PlayerState.Playing
          );
        }}
      >
        <SvgAsset
          iconName={playerState === PlayerState.Playing ? "pause" : "play"}
        ></SvgAsset>
      </div>

      <div
        role="button"
        className="option-item"
        onClick={() => {
          sendCommand("SkipToNext");
        }}
      >
        <SvgAsset iconName="skip-right"></SvgAsset>
      </div>
    </div>
  );

  return (
    <div className="minimode-page-container">
      <div
        className="minimode-header-container"
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        <div className="mini-mode-header-background-mask"></div>
        <div
          className="mini-mode-header-background"
          style={{
            backgroundImage: `url(${currentMusicItem?.artwork || albumImg})`,
          }}
        ></div>
        <img
          title={
            (currentMusicItem?.title || t("media.unknown_title")) +
            " - " +
            (currentMusicItem?.artist || t("media.unknown_artist"))
          }
          draggable="false"
          className="album-container"
          src={currentMusicItem?.artwork || albumImg}
          onDoubleClick={() => {
            ipcRendererSend("show-mainwindow");
          }}
        ></img>
        <div className="body-container">{hover ? options : textContent}</div>
      </div>
    </div>
  );
}
