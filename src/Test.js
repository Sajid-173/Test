import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Stage, Layer, Rect, Image, Text, Group } from "react-konva";
import useImage from "use-image";
import { Row, Col } from "antd";
const Data = ({ data }) => {
  return data?.map((item) => <>{JSON.stringify(item)}</>);
};
const DrawAnnotations = (props) => {
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [image] = useImage(
    "https://media.istockphoto.com/id/1251531558/vector/architecture-plan-set-of-apartment-studio-condominium-flat-house.webp?s=612x612&w=is&k=20&c=AJ0UXcgyhuRc7yb6OWY3trLVZONHHvGRYoLZKvHLvG0="
  );

  const handleMouseDown = (event) => {
    if (newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
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
        width: x - sx,
        height: y - sy,
        key: annotations.length + 1,
      };
      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations(annotations);
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
          width: x - sx,
          height: y - sy,
          key: "0",
        },
      ]);
    }
  };

  const annotationsToDraw = [...annotations, ...newAnnotation];
  console.log(annotationsToDraw[0]);
  return (
    <>
      <Stage
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        width={900}
        height={700}
      >
        <Layer>
          <Image image={image} width={900} height={700} />

          {annotationsToDraw.map((value) => {
            return (
              <>
                <Rect
                  x={value.x}
                  y={value.y}
                  width={value.width}
                  height={value.height}
                  fill="transparent"
                  stroke="red"
                />
                <Text
                  x={value.x + 10}
                  y={value.y + value.height / 2}
                  Text={`Area:  ${annotations.length}`}
                  fill="black"
                  width="50px"
                />
              </>
            );
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default function App() {
  const [localData, setLocalData] = useState([]);

  let c = 0;
  const data = (d) => {
    setLocalData(d);

    // console.log("sajid", d);
  };

  return (
    <Row>
      <Col sm={10}>
        <p>Start to draw!</p>
        <DrawAnnotations data={(d) => data(d)} />
      </Col>
      <Col sm={10}>
        <Data data={localData} />
        <h2>dtfg</h2>
      </Col>
    </Row>
  );
}
