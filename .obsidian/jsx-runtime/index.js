import { TestCard } from "./test.jsx";
import format from "./lib/stringFormat.js";
import AttributeApplier from "./ui-kit/AttributeApplier.jsx";
import ProgressView from "./ui-kit/ProgressView.jsx";
import CalculatedString from "./ui-kit/CalculatedString.jsx";
import DataviewItemList from "./ui-kit/DataviewItemList.jsx";
import AttributeWithBar from "./widgets/AttributeWithBar.jsx";
import PointsWidget from "./widgets/PointsWidget.jsx";
import AddFileToFMForm from "./widgets/AddFileToFMForm.jsx";
import RemoveFromFMListButton from "./widgets/RemoveFromFMListButton.jsx";
import CreateEquipmentButton from "./widgets/CreateEquipmentButton.jsx";

function Stack(props) {
  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: props.direction || "column",
        gap: props.gap || 8,
      },
    },
    props.children
  );
}

function Card(props) {
  return React.createElement(
    "div",
    {
      style: {
        border: "1px solid var(--background-modifier-border)",
        borderRadius: "10px",
        padding: "12px",
        background: "var(--background-primary-alt)",
      },
    },
    props.children
  );
}

function Badge(props) {
  return React.createElement(
    "span",
    {
      style: {
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "12px",
        background: "var(--interactive-accent)",
        color: "var(--text-on-accent)",
      },
    },
    props.children
  );
}

module.exports = {
  Stack,
  Card,
  Badge,
  TestCard,
  format,
  AttributeApplier,
  ProgressView,
  CalculatedString,
  DataviewItemList,
  AttributeWithBar,
  PointsWidget,
  AddFileToFMForm,
  RemoveFromFMListButton,
  CreateEquipmentButton,
};
