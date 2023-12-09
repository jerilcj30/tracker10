import React from 'react';
// @ts-ignore
import Tree from 'react-d3-tree';

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
const orgChart = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
};

export default function OrgChartTree() {

    const pathClassFunc = () =>{
        // appends classname for tree edjes
        return "pathClassFuncClassName"
      }
    
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: '100vw', height: '100vh' }}>
      <Tree data={orgChart} orientation rootNodeClassName="rootNodeClassName" // appends classname for root node
          branchNodeClassName="branchNodeClassName" //appends classname for branch nodes
          leafNodeClassName="leafNodeClassName" //appends classname for leaf nodes
          pathClassFunc={pathClassFunc} 
        /> 
    </div>
  );
}