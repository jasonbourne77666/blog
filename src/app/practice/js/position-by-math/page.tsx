"use client";

import { useEffect } from "react";
import classnames from "classnames";
import style from "../index.module.scss";

// 曲线函数计算
class Curve {
  // 传入曲线函数
  curveFunc: (...args: number[]) => number;
  // x轴范围
  xRang: number[];
  // y轴范围
  yRang: number[];
  constructor(curveFunc, xRang, yRang) {
    this.curveFunc = curveFunc;
    this.xRang = xRang;
    this.yRang = yRang;
  }

  getY(x: number) {
    let y = this.curveFunc(x);

    if (x < this.xRang[0]) {
      y = this.curveFunc(this.xRang[0]);
    } else if (x > this.xRang[1]) {
      y = this.curveFunc(this.xRang[1]);
    }

    if (y < this.yRang[0]) {
      y = this.yRang[0];
    }

    if (y > this.yRang[1]) {
      y = this.yRang[1];
    }

    return y;
  }
}

// 布局函数
function layout(
  curve: Curve,
  doms: Array<HTMLLIElement | Element>,
  width: number,
  height: number
) {
  const [minX, maxX] = curve.xRang;
  const [minY, maxY] = curve.yRang;

  // x轴中心点位置
  const cx = (minX + maxX) / 2;
  // y轴中心点位置
  const cy = (minY + maxY) / 2;

  // 缩放倍率
  const xScale = width / (maxX - minX);
  const yScale = height / (maxY - minY);

  // 元素间隔 根据范围宽度和dom数量计算平分，数学坐标的距离
  const xStep = (maxX - minX) / (doms.length - 1);

  for (let i = 0; i < doms.length; i++) {
    const dom = doms[i] as HTMLLIElement;
    const x = minX + i * xStep; // 横坐标（数学坐标的距离） 根据容器宽度和dom数量计算平分
    const y = curve.getY(x); // 带入公式计算得出数学坐标

    // xy轴范围（xRang，yRang）不在原点的对称两边时需要平移，对应到dom的中心点
    // (x - cx) 平移原点坐标，demo原点在容器正中间。
    const dx = (x - cx) * xScale;
    const dy = (y - cy) * yScale;
    dom.style.setProperty("--dx", String(dx));
    dom.style.setProperty("--dy", String(dy));
  }
}

const waves = {
  wave() {
    const container = document.querySelector(".mathPositionWrapper");
    const doms = document.querySelectorAll(".mathPositionWrapper li");

    const wave = new Curve(
      (x: number) => Math.sin(x),
      // [-1 * Math.PI, 3 * Math.PI],
      [0, 3 * Math.PI],
      [-1, 1]
    );
    layout(
      wave,
      [...doms],
      container!.clientWidth - 100,
      container!.clientHeight - 100
    );
  },
  line() {
    const container = document.querySelector(".mathPositionWrapper");
    const doms = document.querySelectorAll(".mathPositionWrapper li");

    const wave = new Curve((x: number) => 0, [0, 1], [-1, 1]);
    layout(
      wave,
      [...doms],
      container!.clientWidth - 100,
      container!.clientHeight
    );
  },
  crossLine() {
    const container = document.querySelector(".mathPositionWrapper");
    const doms = document.querySelectorAll(".mathPositionWrapper li");
    const line1 = new Curve((x: number) => x, [-1, 1], [-1, 1]);
    const line2 = new Curve((x: number) => -x, [-1, 1], [-1, 1]);
    const midIndex = Math.floor(doms.length / 2);
    const doms1 = Array.from(doms).slice(0, midIndex);
    const doms2 = Array.from(doms).slice(midIndex);

    layout(
      line1,
      [...doms1],
      container!.clientWidth - 100,
      container!.clientHeight - 100
    );
    layout(
      line2,
      [...doms2],
      container!.clientWidth - 100,
      container!.clientHeight - 100
    );
  },
  crossWave() {
    const container = document.querySelector(".mathPositionWrapper");
    const doms = document.querySelectorAll(".mathPositionWrapper li");
    const line1 = new Curve(
      (x: number) => Math.sin(x),
      [-1 * Math.PI, 1 * Math.PI],
      [-1, 1]
    );
    const line2 = new Curve(
      (x: number) => Math.sin(x),
      [0, 2 * Math.PI],
      [-1, 1]
    );
    const midIndex = Math.floor(doms.length / 2);
    const doms1 = Array.from(doms).slice(0, midIndex);
    const doms2 = Array.from(doms).slice(midIndex);

    layout(
      line1,
      [...doms1],
      container!.clientWidth - 100,
      container!.clientHeight - 100
    );
    layout(
      line2,
      [...doms2],
      container!.clientWidth - 100,
      container!.clientHeight - 100
    );
  },
};

const App = () => {
  useEffect(() => {
    waves.crossWave();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4" style={{ padding: "20px 0" }}>
        <button className="primary-button" onClick={waves.wave}>
          波浪
        </button>
        <button className="primary-button" onClick={waves.line}>
          直线
        </button>
        <button className="primary-button" onClick={waves.crossLine}>
          交叉直线
        </button>
        <button className="primary-button" onClick={waves.crossWave}>
          交叉波浪
        </button>
      </div>
      <ul
        className={classnames(style.mathPositionWrapper, "mathPositionWrapper")}
      >
        {Array.from({ length: 50 }, (_, index) => index).map((item) => (
          <li key={item} />
        ))}
      </ul>
    </div>
  );
};

export default App;
