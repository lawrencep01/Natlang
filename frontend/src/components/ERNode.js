import React, { useState, useRef, useEffect } from "react";
import { Handle } from "@xyflow/react";
import { FaKey } from "react-icons/fa6";
import Tooltip from "../shared/Tooltip";

/**
 * Function to map long data types to shorter terms.
 *
 * @param {string} type - The original data type.
 * @returns {string} - The shortened data type or the original if no mapping exists.
 */
const getShortenedType = (type) => {
  const typeMapping = {
    "character varying": "varchar",
    "timestamp without time zone": "timestamp",
    "time without time zone": "time",
  };
  return typeMapping[type] || type; // Return the mapped type or original if no mapping exists
};

/**
 * ERNode Component
 *
 * Represents an entity-relationship node displaying table information and its columns.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data for the ERNode, including label and columns.
 * @param {Function} [props.data.onHover] - Optional hover handler function.
 * @returns {JSX.Element} - The rendered ERNode component.
 */
const ERNode = (props) => {
  const { data } = props;
  const [clickedColumn, setClickedColumn] = useState(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (nodeRef.current) {
      const { offsetWidth, offsetHeight } = nodeRef.current;
      if (data.onDimensionsChange) {
        data.onDimensionsChange(data.label, offsetWidth, offsetHeight);
      }
    }
  }, [nodeRef, data]);

  /**
   * Handler for mouse enter event on a column.
   *
   * @param {string} columnName - The name of the column being hovered.
   */
  const handleMouseEnter = (columnName) => {
    if (data.onHover) {
      data.onHover(`${data.schema}.${data.label}.${columnName}`); // Trigger onHover with the full column name including schema
      console.log(`${data.schema}.${data.label}.${columnName}`);
    }
  };

  /**
   * Handler for mouse leave event on a column.
   */
  const handleMouseLeave = () => {
    if (data.onHover) {
      data.onHover(null); // Reset onHover when mouse leaves
    }
  };

  /**
   * Handler for click event on a column.
   *
   * @param {string} columnName - The name of the column being clicked.
   */
  const handleClick = (columnName) => {
    setClickedColumn(clickedColumn === columnName ? null : columnName);
  };

  return (
    <div ref={nodeRef} className="bg-white border border-gray-300 rounded-sm shadow-md relative">
      {/* Header section displaying the table name */}
      <div className={`font-semibold text-center p-2 ${data.color}`}>
        {data.label}
      </div>

      <div className="text-sm">
        {data.columns.map((col) => (
          <div
            key={col.name}
            className="relative flex items-center hover:bg-gray-100 cursor-pointer p-2 w-full"
            onMouseEnter={() => handleMouseEnter(col.name)} // Attach mouse enter handler
            onMouseLeave={handleMouseLeave} // Attach mouse leave handler
            onClick={() => handleClick(col.name)} // Attach click handler
          >
            {/* Handle for incoming relationships */}
            <Handle
              type="target"
              position="left"
              id={`${col.name}-target`}
              className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 opacity-0"
            />
            <div className="flex justify-between w-full">
              <span className="text-left flex">
                {col.primary_key && <FaKey className="inline text-gray-500 " />}{" "}
                <span className="inline-block">{col.name}</span>
              </span>
              <span className="italic tracking-tight flex-none ml-4">
                {getShortenedType(col.type)} {/* Display shortened type */}
              </span>
            </div>
            {/* Handle for outgoing relationships */}
            <Handle
              type="source"
              position="right"
              id={`${col.name}-source`}
              className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 opacity-0"
            />
            <Tooltip text={col.description || "No description available"} visible={clickedColumn === col.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ERNode;
