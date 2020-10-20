import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import { LegendOrdinal, LegendItem, LegendLabel } from '@visx/legend';

// implement algorithm to check snapshot history and their respective colors

const legendGlyphSize = 8;

type snapHierarchy = {`Record<string, unknown>`}  
};

export default function LegendKey(props: snapHierarchy) {
  const { hierarchy } = props;
  // console.log('which ends up being, hierarchy: ', hierarchy);

  // We are taking the array of displayNames and sifting through them and placing each set of
  // branches as a key in an object, { '.0': [1.0, 2.0, 3.0, 4.0], '.1': [1.1, 2.1, 3.1,...], '.2': [....]}
  // we then take that and place it in an array, with each element being a range of the values in that branch -> ['1.0-4.0', '1.1-6.1',...]
  function colorRanger(snapshotIdsArray) {
    const resultRangeColor = {};

    for (let i = 0; i < snapshotIdsArray.length; i += 1) {
      const current = snapshotIdsArray[i];
      let key = current - Math.floor(current);
      key = key.toFixed(2);

      if (current % 1 === 0) {
        key = current - Math.floor(current);
        resultRangeColor[key]
          ? resultRangeColor[key].push(current)
          : (resultRangeColor[key] = [current]);
      } else if (current - Math.floor(current) !== 0) {
        resultRangeColor[key]
          ? resultRangeColor[key].push(current)
          : (resultRangeColor[key] = [current]);
      }
    }
    // now we convert the object to an array, each index being a string of the range of the branch
    const branchesArr = [];
    const arrValues = Object.values(resultRangeColor);

    for (let i = 0; i < arrValues.length; i += 1) {
      const len = arrValues[i].length;
      const tempVal = `${arrValues[i][0]} - ${arrValues[i][len - 1]}`;
      branchesArr.push(tempVal);
    }
    return branchesArr;
  }

  const getSnapshotIds = (obj, snapshotIds = []) => {
    snapshotIds.push(`${obj.name}.${obj.branch}`);
    if (obj.children) {
      obj.children.forEach((child) => {
        getSnapshotIds(child, snapshotIds);
      });
    }
    const resultRange = colorRanger(snapshotIds);
    return resultRange;
  };

  // invoking getSnaphshotIds, which will ultimately return our array of split up branches
  const snap = getSnapshotIds(hierarchy);

  const ordinalColorScale = scaleOrdinal<number, string>({
    domain: snap,
    range: [
      '#95B6B7',
      '#475485',
      '#519331',
      '#AA5039',
      '#8B2F5F',
      '#C5B738',
      '#858DFF',
      '#FF8D02',
      '#FFCD51',
      '#ACDAE6',
      '#FC997E',
      '#CF93AD',
      '#AA3939',
      '#AA6C39',
      '#226666',
      '#2C4870',
    ],
  });

  return (
    <div className="legends">
      <LegendVisual title="State Snapshots">
        <LegendOrdinal scale={ordinalColorScale}>
          {(labels) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {labels.map((label, i) => (
                <LegendItem
                  key={`legend-quantile-${i}`}
                  margin="0 5px"
                  onClick={() => {
                    // if (Event) alert('clicked: YO BRILLIANT GENIUS');
                  }}
                >
                  <svg width={10} height={10}>
                    <rect
                      fill={label.value}
                      width={legendGlyphSize}
                      height={legendGlyphSize}
                    />
                  </svg>
                  <LegendLabel align="left" margin="0 0 0 4px">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              ))}
            </div>
          )}
        </LegendOrdinal>
      </LegendVisual>

      <style jsx>
        {`
          .legends {
            position: center;
            width: 25%;
            font-family: arial;
            font-weight: 900;
            // background-color: 242529;
            border-radius: 14px;
            padding: 2px 2px 2px 2px;
            overflow-y: auto;
            flex-grow: 1;
          }
        `}
      </style>
    </div>
  );
}

function LegendVisual({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="legend">
      <div className="title">{title}</div>
      {children}
      <style jsx>
        {`
          .legend {
            position: absolute;
            with: 120px;
            line-height: 0.9em;
            color: #efefef;
            font-size: 9px;
            font-family: arial;
            padding: 10px 10px;
            float: left;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            margin: 5px 5px;
          }
          .title {
            font-size: 12px;
            margin-bottom: 10px;
            font-weight: 100;
          }
        `}
      </style>
    </div>
  );
}
