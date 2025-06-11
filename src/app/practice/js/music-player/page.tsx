"use client";

import React, { useRef, useEffect, useState } from "react";
import style from "./index.module.scss";
import { liyrc } from "./data";

/**
 *
 * @param params 歌词
 * @returns { time,word }
 */
function parseLiyrc(params: string): Array<{ time: number; word: string }> {
  const lines = params
    .split("\n")
    .filter((item) => {
      return item && typeof item === "string";
    })
    .map((item, index) => {
      const parts = item.split("]");
      const timeStr = parts?.[0]?.substring(1);
      let obj = { time: 0, word: parts?.[1] };
      // console.log(obj);
      const computedTime = parseTime(timeStr);
      obj = computedTime
        ? { ...obj, time: computedTime }
        : { ...obj, word: timeStr };
      return obj;
    });

  return lines;
}

function parseTime(params: string): number {
  const parts = params.split(":");
  return +parts[0] * 60 + +parts[1];
}

// 计算高亮歌词下标
function findIndex(
  dom: HTMLAudioElement | null,
  list: Array<{ time: number; word: string }>
) {
  const currentTime = dom?.currentTime || 0;
  for (let i = 0; i < list.length; i++) {
    const cur = list[i];
    if (currentTime < cur.time) {
      return i - 1;
    }
  }
  // 最后的歌词
  return list.length - 1;
}

export default function MusicPlayer(props: any) {
  const audioRef = useRef(null);
  const listWrapperRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = parseLiyrc(liyrc);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [liHeight, setLiHeight] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [active, setActive] = useState<number>(-1);
  function setOffset() {
    const index = findIndex(audioRef.current, lines);
    console.log(index);
    setActive(index === -1 ? 0 : index);

    let offset = liHeight * index + liHeight / 2 - containerHeight / 2;

    if (offset < 0) {
      offset = 0;
    }
    if (offset > maxHeight) {
      offset = maxHeight;
    }
    if (listWrapperRef.current) {
      listWrapperRef.current.style.transform = `translateY(-${offset}px)`;
    }
  }
  // 初始数据
  useEffect(() => {
    // 容器高度
    const containerHeight = containerRef.current?.clientHeight || 0;
    // 每条歌词高度
    const liHeight = listWrapperRef.current?.children[0]?.clientHeight || 0;
    setContainerHeight(containerHeight);
    setLiHeight(liHeight);
    setMaxHeight((listWrapperRef.current?.clientHeight || 0) - containerHeight);
  }, []);

  return (
    <div className={style.container}>
      <audio
        ref={audioRef}
        className={style.audio}
        onTimeUpdate={() => {
          setOffset();
        }}
        controls
        src="/music/Coldplay-viva la vida.flac"
      ></audio>

      <div className={style.lyricsWrapper} ref={containerRef}>
        <ul ref={listWrapperRef}>
          {lines.map((item, index) => (
            <li className={active === index ? style.active : ""} key={index}>
              {item.word}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
