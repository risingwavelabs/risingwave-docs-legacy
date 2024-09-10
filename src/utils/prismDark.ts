import { themes, PrismTheme } from 'prism-react-renderer';

const base = themes.dracula;

export default {
  ...base,
  plain: {
    backgroundColor: "#001017",
  },
  styles: [
    ...base.styles,
    {
      types: ["title"],
      style: {
        color: "#0550AE",
        fontWeight: "bold",
      },
    },
    {
      types: ["parameter"],
      style: {
        color: "#953800",
      },
    },
    {
      types: ["boolean", "rule", "color", "number", "constant", "property"],
      style: {
        color: "#8665b6",
      },
    },
    {
      types: ["atrule", "tag"],
      style: {
        color: "#22863A",
      },
    },
    {
      types: ["script"],
      style: {
        color: "#24292E",
      },
    },
    {
      types: ["operator", "unit", "rule"],
      style: {
        color: "#ebebeb",
      },
    },
    {
      types: ["not"],
      style: {
        color: "#D73A49",
      },
    },
    {
      types: ["font-matter", "attr-value"],
      style: {
        color: "#393a34",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "#4A9D63",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "#0550AE",
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "#6db7ff",
        fontStyle: "normal",
      },
    },
    {
      types: ["label"],
      style: {
        color: "#e19134",
      },
    },
    {
      types: ["function"],
      style: {
        color: "#c3636a",
      },
    },
    {
      types: ["selector"],
      style: {
        color: "#6F42C1",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "#E36209",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "#6B6B6B",
      },
    },
    {
      types: ["custom"],
      style: {
        color: "#ebebeb",
        fontStyle: "italic",
      },
    },
    {
      types: ["datatype"],
      style: {
        color: "#e19135",
      },
    },
    {
      types: ["string"],
      style: {
        color: "#ebebeb",
        fontStyle: "italic",
      },
    },
  ],
} satisfies PrismTheme;
