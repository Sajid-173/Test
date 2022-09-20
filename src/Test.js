import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Stage,
  Layer,
  Rect,
  Image,
  Text,
  Group,
  Label,
  Tag,
} from "react-konva";
import useImage from "use-image";
import "antd/dist/antd.min.css";
import { Row, Col, Input } from "antd";
import RectComponent from "./Rectcomponents";

//mapping data
const Data = ({ data }) => {
  return data?.map((item) => (
    <>
      <Row>
        <Col span={6}>
          <Input addonBefore="Area" value={item.name} />
        </Col>
        <Col span={6}>
          <Input addonBefore="Width" value={Math.abs(item.width)} />
        </Col>
        <Col span={6}>
          <Input addonBefore="Height" value={Math.abs(item.height)} />
        </Col>
      </Row>

      {/* <div><h2>new data</h2></div> */}
    </>
  ));
};

//Drawaing Annotions
const DrawAnnotations = (props) => {
  //draw code for dynamic rectange

  const [active, setActive] = useState(true);

  const initialRectangles = [
    {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      fill: "red",
      id: "rect1",
    },
  ];

  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [image] = useImage(
    "https://online.visual-paradigm.com/repository/images/c0f8b0e3-db02-4661-bd08-947c8b414343/floor-plan-design/simple-apartment-floor-plan.png"
  );

  const [rectangles, setRectangles] = React.useState(annotations);
  const [selectedId, selectShape] = React.useState(null);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleMouseDown = (event) => {
    if (active === true) {
      if (newAnnotation.length === 0) {
        const { x, y } = event.target.getStage().getPointerPosition();
        setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
      }
    }
  };

  const handleMouseUp = (event) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      const annotationToAdd = {
        x: sx,
        y: sy,
        width: Math.trunc(x - sx),
        height: Math.trunc(y - sy),
        key: annotations.length + 1,
        name: `Area ${annotations.length + 1}`,
      };
      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations(annotations);
      setActive(false);
    }
  };
  useEffect(() => {
    if (annotations) props.data([...annotations, ...newAnnotation]);
  }, [annotations, newAnnotation]);

  const handleMouseMove = (event) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: Math.trunc(x - sx),
          height: Math.trunc(y - sy),
          key: "0",
          name: "",
        },
      ]);
    }
  };

  const annotationsToDraw = [...annotations, ...newAnnotation];
  // console.log(annotationsToDraw[0]);
  return (
    <>
      <Stage
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        width={700}
        height={500}
      >
        <Layer>
          <Image image={image} width={700} height={500} />

          {annotationsToDraw.map((rect, i) => {
            return (
              <RectComponent
                key={i}
                shapeProps={rect}
                isSelected={rect.id === selectedId}
                onSelect={() => {
                  selectShape(rect.id);
                }}
                onChange={(newAttrs) => {
                  const rects = annotations.slice();
                  rects[i] = newAttrs;
                  setRectangles(rects);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default function App() {
  const [localData, setLocalData] = useState([]);
  const data = (d) => {
    setLocalData(d);

    // console.log("sajid", d);
  };

  return (
    <Row align="middle" justify="center">
      <Col span={8}>
        <h2>Start to draw!</h2>
        <DrawAnnotations data={(d) => data(d)} />
      </Col>
      <Col span={8} offset={6}>
        <h2>Area</h2>
        <Data data={localData} />
      </Col>
    </Row>
  );
}
