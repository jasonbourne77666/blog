'use client';

import React, { useRef } from 'react';
import style from './index.module.scss';
import { PlusCircle } from 'lucide-react';

const goods = [
  {
    pic: './assets/g1.png',
    title: '椰云拿铁',
    desc: `1人份【年度重磅，一口吞云】

    √原创椰云topping，绵密轻盈到飞起！
    原创瑞幸椰云™工艺，使用椰浆代替常规奶盖
    打造丰盈、绵密，如云朵般细腻奶沫体验
    椰香清甜饱满，一口滑入口腔
    
    【饮用建议】请注意不要用吸管，不要搅拌哦~`,
    sellNumber: 200,
    favorRate: 95,
    price: 32,
  },
  {
    pic: './assets/g2.png',
    title: '生椰拿铁',
    desc: `1人份【YYDS，无限回购】
    现萃香醇Espresso，遇见优质冷榨生椰浆，椰香浓郁，香甜清爽，带给你不一样的拿铁体验！
    
    主要原料：浓缩咖啡、冷冻椰浆、原味调味糖浆
    图片及包装仅供参考，请以实物为准。建议送达后尽快饮用。到店饮用口感更佳。`,
    sellNumber: 1000,
    favorRate: 100,
    price: 19.9,
  },
  {
    pic: './assets/g3.png',
    title: '加浓 美式',
    desc: `1人份【清醒加倍，比标美多一份Espresso】
    口感更佳香醇浓郁，回味持久
    图片仅供参考，请以实物为准。建议送达后尽快饮用。`,
    sellNumber: 200,
    favorRate: 93,
    price: 20.3,
  },
  {
    pic: './assets/g4.png',
    title: '瓦尔登蓝钻瑞纳冰',
    desc: `1人份【爆款回归！蓝色治愈力量】
    灵感来自下澄明、碧蓝之境---瓦尔登湖。含藻蓝蛋白，梦幻蓝色源自天然植物成分，非人工合成色素，融入人气冷榨生椰浆，椰香浓郁，清冽冰爽；底部添加Q弹小料，0脂原味晶球，光泽剔透，如钻石般blingbling。搭配奶油顶和彩虹色棉花糖，满足你的少女心～
    【去奶油小提示】由于去掉奶油后顶料口味会受影响，为保证口感，选择“去奶油”选项时将同时去掉奶油及顶料，请注意哦！【温馨提示】瑞纳冰系列产品形态为冰沙，无法进行少冰、去冰操作，请您谅解。【图片仅供参考，请以实物为准】`,
    sellNumber: 17,
    favorRate: 80,
    price: 38,
  },
  {
    pic: './assets/g5.png',
    title: '椰云精萃美式',
    desc: `1人份【不用吸管 大口吞云！】

    1杯热量*≈0.6个苹果！
    原创瑞幸椰云™工艺，将「椰浆」变成绵密、丰盈的“云朵”，口感绵密顺滑！0乳糖植物基，清爽轻负担！
    
    *数据引自《中国食物成分表》第六版，苹果每100克可食部分中能量约为53千卡，以每个苹果250克/个计，1杯椰云精萃美式约80千卡，相当于约0.6个苹果。
    【图片仅供参考，请以实物为准】`,
    sellNumber: 50,
    favorRate: 90,
    price: 21.12,
  },
];

const App: React.FC<any> = (props) => {
  const listDom = useRef<HTMLUListElement>(null);
  const carDom = useRef<HTMLDivElement>(null);
  const jump = (index: number) => {
    const domRect = carDom.current?.getBoundingClientRect();
    const startDom = listDom.current?.children[index].querySelector('i');
    const startRect = startDom?.getBoundingClientRect();
    const start = {
      x: startRect?.left,
      y: startRect?.top,
    };

    if (domRect) {
      const tagetCar = {
        x: domRect?.left + domRect?.width / 2,
        y: domRect.top + domRect.height / 5,
      };
      const wrapper = document.createElement('div');
      const d = document.createElement('div');
      wrapper.className = 'add_car_fly';
      wrapper.style.transform = `translateX(${start.x}px)`;
      wrapper.style.opacity = '1';

      // 清除动画
      carDom.current?.addEventListener('animationend', () => {
        carDom.current?.classList.remove(style.animation);
      });
      // 删除wrapper
      wrapper.addEventListener(
        'transitionend',
        () => {
          wrapper.remove();
          // 购物车加动画
          carDom.current?.classList.add(style.animation);
        },
        {
          once: true, //仅触发一次
        },
      );

      d.textContent = '+';
      d.style.transform = `translateY(${start.y}px)`;

      wrapper.appendChild(d);
      document.body.appendChild(wrapper);

      // 强行渲染，不等下一次改变style。多渲染一次，引发回流reflow
      const width = wrapper.clientWidth;
      // 或者使用 window.requestAnimationFrame

      wrapper.style.transform = `translateX(${tagetCar.x}px)`;
      d.style.transform = `translateY(${tagetCar.y}px)`;
    }
  };
  return (
    <div className={style.container}>
      <ul className={style.list} ref={listDom}>
        {goods.map((item, index) => (
          <li className={style.item} key={index}>
            <div className={style.left}></div>
            <div className={style.right}>
              <p>{item.title}</p>
              <div className='flex items-center justify-end'>
                <i
                  onClick={() => {
                    jump(index);
                  }}
                >
                  <PlusCircle />
                </i>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* <div className={style.fly}>
        <PlusCircleOutlined style={{ fontSize: '20px' }} />
      </div> */}
      <div ref={carDom} className={style.car}></div>
    </div>
  );
};

export default App;
