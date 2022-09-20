import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { Stage, Layer, Rect, Transformer, Text } from "react-konva";

const RectComponent = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  const [Zx, setZX] = useState(shapeProps.x);
  const [Zy, setZY] = useState(shapeProps.y);
  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        fill="#E5000010"
        stroke="red"
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange(() => ({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          }));
          setZX(e.target.x());
          setZY(e.target.y());
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          // node.scaleX(1);
          // node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      <Text
        x={
          Zx > 0
            ? Zx + shapeProps.width / 2 - 25
            : Zx + shapeProps.width / 2 - 25
        }
        y={Zy > 0 ? Zy + shapeProps.height / 2 - 20 : Zy + shapeProps.height}
        Text={`Area: 1`}
        fill="black"
      />

      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default RectComponent;
