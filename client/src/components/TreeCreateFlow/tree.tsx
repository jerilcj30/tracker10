
import React from 'react';
import { useState } from 'react';
// @ts-ignore
import Tree from "react-d3-tree";
import { TreeDialog } from "./treeDialog";
import { RawNodeDatum, TreeNodeDatum} from '../../../node_modules/react-d3-tree/lib/types/types/common'
import { useTreeStore } from '../../store/store';
import { nanoid } from 'nanoid'

export interface TreeSchema {
  name: string;
  attributes?: Record<string, number> | undefined;
  children?: RawNodeDatum[] | undefined;
}

export default function FlowTree() {

  //accessing zustand store
  const {saveTree} = useTreeStore();

  // const { toast } = useToast();
  const [tree, setTree] = useState<RawNodeDatum | RawNodeDatum[]>({
    name: nanoid(11),
    children: [],
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [node, setNode] = React.useState<TreeNodeDatum | undefined>();  

  const handleSubmit = (
    nodeType: string,
    nodeId: string,
    nodeName: number,    
    nodeWeight: number
  ) => {
    // @ts-ignore
    const newTree = bfs(node?.data?.name, tree, nodeType, nodeId, nodeName, nodeWeight);
    if (newTree) {
      setTree(newTree);
      // storing to zustand store
      saveTree(newTree as TreeSchema)
    }
    
  };

  const pathClassFunc = () =>{
    // appends classname for tree edjes
    return "pathClassFuncClassName"
  }


  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: "30em", height: "20em" }}>
      <Tree
          data={tree}
          onNodeClick={(datum: TreeNodeDatum) => {
            setNode(datum);
            setIsOpen(true);
          }}
          translate={{
            x: 220,
            y: 150,
          }}
          orientation
          collapsible={false}
          separation={{ nonSiblings: 2, siblings: 2 }}
          rootNodeClassName="rootNodeClassName" // appends classname for root node
          branchNodeClassName="branchNodeClassName" //appends classname for branch nodes
          leafNodeClassName="leafNodeClassName" //appends classname for leaf nodes
          pathClassFunc={pathClassFunc} // function which appends classname for edjes
        />
        <TreeDialog 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSubmit={handleSubmit}

        />
    </div>
  );
}

function bfs(
  name: string,
  tree: RawNodeDatum | RawNodeDatum[],
  nodeType: string,
  nodeId: string,
  nodeName: number,  
  nodeWeight: number
) {
  const queue: RawNodeDatum[] = [];

  queue.unshift(tree as RawNodeDatum);

  while (queue.length > 0) {
    const curNode = queue.pop();

    if (curNode?.name === name) {
      curNode?.children?.push({
        name: nodeId,
        attributes: { nodeName, nodeType, nodeWeight },
        children: [],
      });
      return { ...tree };
    }

    // @ts-ignore
    for (let i = 0; i < curNode?.children.length; i++) {
      // @ts-ignore
      queue.unshift(curNode?.children[i]);
    }
  }
}