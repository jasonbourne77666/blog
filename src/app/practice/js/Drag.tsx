import React, { useEffect, useRef, useState } from "react";
// import { Flipper, Flipped } from 'react-flip-toolkit';

import style from "./index.module.scss";

class Flip {
  dom: HTMLElement;
  start: number;
  end: number = 0;
  isPlaying: boolean = false;

  constructor(dom: HTMLElement) {
    this.dom = dom;
    this.start = this.getLocaton();
  }

  getLocaton() {
    const rect = this.dom.getBoundingClientRect();
    return rect.top;
  }

  ref(callback: () => void) {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  }

  play() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    this.end = this.getLocaton();
    const distance = this.start - this.end;
    console.log("play", distance);

    this.dom.style.transform = `translateY(${distance}px)`;

    this.ref(() => {
      this.dom.style.transition = "transform .5s";
      this.dom.style.removeProperty("transform");
    });

    this.start = this.end;
    this.dom.style.removeProperty("transition");
    setTimeout(() => {
      this.isPlaying = false;
    }, 500);
  }
}

const Drag = () => {
  const list = useRef<HTMLUListElement | null>(null);
  const sourceDom = useRef<HTMLLIElement | null>(null);
  const [data, setData] = useState([1, 2, 3, 4, 5]);
  const flipRef = useRef<any>(null);

  useEffect(() => {
    const f = document.getElementById("2")!;
    flipRef.current = new Flip(f);
  }, []);

  return (
    <div className={style.dragContainer}>
      <button onClick={() => {}}>filp动画</button>
      <ul
        ref={list}
        onDragStart={(e: any) => {
          e.dataTransfer.effectAllowed = "move";
          setTimeout(() => {
            e.target.classList.add(style.moving);
          }, 0);
          sourceDom.current = e.target;
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragEnter={(e: any) => {
          // 进入自身或者list
          if (e.target === list.current || e.target === sourceDom.current) {
            return;
          }
          const children = list.current ? [...list.current?.children] : [];
          const sourceIndex = children.indexOf(sourceDom.current!);
          const targetIndex = children.indexOf(e.target);
          if (sourceIndex < targetIndex) {
            list.current?.insertBefore(
              sourceDom.current!,
              (e.target as HTMLDivElement).nextElementSibling
            );
          } else {
            list.current?.insertBefore(sourceDom.current!, e.target);
          }

          flipRef.current.play();
        }}
        onDragEnd={(e: any) => {
          e.target.classList.remove(style.moving);
          const newListDom: Array<any> = list.current?.children
            ? [...list.current?.children]
            : [];
          const newListData: Array<number> = newListDom.map((item) => {
            const id = Number((item as HTMLElement).getAttribute("id"));
            return id;
          });

          setData(newListData);
        }}
        className={style.list}
      >
        {data.map((item) => (
          <li
            key={item}
            id={String(item)}
            draggable={true}
            className={style.listItem}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Drag;
