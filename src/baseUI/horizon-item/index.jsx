import PropTypes from "prop-types";
import { memo, useEffect, useRef } from "react";
import Scroll from "../scroll";
import styled from "styled-components";
import style from "../../assets/global-style";

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: gray;
    font-size: ${style["font-size-m"]};
    vertical-align: middle;
  }
`;

const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`;

function Horizon(props) {
  const { list, oldVal, title } = props;
  const { handleClick } = props;

  const categoryRef = useRef(null);

  // 计算 子标签的宽度给包裹的外层元素
  useEffect(() => {
    const categoryDom = categoryRef.current;
    // 找到档期啊元素下面的 span 元素 ，计算他们的宽度总和
    const tagElems = categoryDom.querySelectorAll("span");
    let totalWidth = 0;
    Array.from(tagElems).forEach((ele) => {
      totalWidth += ele.offsetWidth;
    });
    // 给包裹的外层 div 设置宽度
    categoryDom.style.width = totalWidth + "px";
  }, []);
  return (
    <Scroll direction="horizontal">
      <div ref={categoryRef}>
        <List>
          <span>{title}</span>
          {list.map((item) => {
            return (
              <ListItem
                key={item.key}
                className={`${oldVal === item.key ? "selected" : ""}`}
                onClick={() => handleClick(item.key)}
              >
                {item.name}
              </ListItem>
            );
          })}
        </List>
      </div>
    </Scroll>
  );
}

Horizon.propTypes = {
  List: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func,
};

Horizon.defaultProps = {
  list: [],
  oldVal: "",
  title: "",
  handleClick: null,
};

export default memo(Horizon);
