import React from "react";

interface DummyContentListProps {
  numberOfItems?: number;
}

const DummyContentList: React.FC<DummyContentListProps> = ({ numberOfItems }) => {
  return (
    <>
      {Array(numberOfItems ?? 10)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="h-[10rem] bg-gray-200 m-[1rem] rounded" aria-hidden="true" />
        ))}
    </>
  );
};

export default DummyContentList;
