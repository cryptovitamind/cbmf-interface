export const factoryAbi = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "created",
          type: "address",
        },
      ],
      name: "Created",
      type: "event",
    },
    {
      inputs: [],
      name: "count",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_burnDest",
          type: "address",
        },
        {
          internalType: "address",
          name: "_token",
          type: "address",
        },
        {
          internalType: "address payable",
          name: "_dest",
          type: "address",
        },
        {
          internalType: "address",
          name: "_pool",
          type: "address",
        },
        {
          internalType: "address",
          name: "_ocPrcAddr",
          type: "address",
        },
        {
          internalType: "address",
          name: "_tp",
          type: "address",
        },
      ],
      name: "create",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "created",
      outputs: [
        {
          internalType: "contract Ktv2",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const;