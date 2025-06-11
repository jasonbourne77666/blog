"use client";

import React from "react";
import Interceptor from "./Interceptor";
import Drag from "./Drag";
import CustomRedux from "./CustomRedux";
import RequestdleCallback from "./RequestdleCallback";
import Defer from "./Defer";
import MathPosition from "./PositionByMath";
import MusicPlayer from "./MusicPlayer";
import ShopCar from "./ShopCar/ShopCar";
import useRective from "@/hooks/useRective";

import style from "./index.module.scss";

const Js = () => {
  const rective = useRective({ current: "shop" });

  return (
    <div className={style.jsContainer}>
      <div className={style.selectWrapper}>
        <select
          defaultValue="shop"
          style={{ width: 320 }}
          onChange={(e: any) => {
            const value = e.target.value;
            rective.current = value;
          }}
        >
          <option value="drag">拖拽排序</option>
          <option value="interceptor">洋葱模型</option>
          <option value="redux">redux</option>
          <option value="requestIdleCallback">
            requestIdleCallback任务分段
          </option>
          <option value="MathPosition">css变量轨迹</option>
          <option value="defer">defer分段渲染</option>
          <option value="music">歌词滚动</option>
          <option value="shop">抛物线运动</option>
        </select>
      </div>

      {rective.current === "interceptor" && <Interceptor />}
      {rective.current === "drag" && <Drag />}
      {rective.current === "redux" && <CustomRedux />}
      {rective.current === "requestIdleCallback" && <RequestdleCallback />}
      {rective.current === "MathPosition" && <MathPosition />}
      {rective.current === "defer" && <Defer />}
      {rective.current === "music" && <MusicPlayer />}
      {rective.current === "shop" && <ShopCar />}
    </div>
  );
};

export default Js;
