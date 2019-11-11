import React from "react";
import { render } from "react-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";

let totalModuleCost = 0;

function createData(Items, price) {
  return { Items, price };
}

const rows = [
  createData("Shirt", 500),
  createData("Pant", 1000),
  createData("Mobile", 50000),
  createData("Laptop", 75000),
  createData("Desktop", 100000)
];

/* Table Head Names */
const headCells = [
  {
    id: "items",
    numeric: false,
    disablePadding: true,
    label: "Items"
  },
  { id: "price", numeric: true, disablePadding: false, label: "Price" }
];

// Table Header
function SelectableFormHead(props) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

SelectableFormHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(3)
  },
  table: {
    minWidth: 100
  },
  tableWrapper: {
    overflowX: "auto"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

export default function SelectableForm() {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);

  const calculateTotalModuleCost = selectedItems => {
    totalModuleCost = selectedItems.reduce(function(acc, val) {
      return acc + val;
    }, 0);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.price);
      setSelected(newSelecteds);
      calculateTotalModuleCost(newSelecteds);
      return;
    } else {
      setSelected([]);
      totalModuleCost = 0;
    }
  };

  const handleClick = (event, price) => {
    const selectedIndex = selected.indexOf(price);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, price);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    calculateTotalModuleCost(newSelected);
  };

  const isSelected = price => selected.indexOf(price) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <SelectableFormHead
              classes={classes}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.price);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, row.price)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.Items}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.Items}
                    </TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={2} align="right">
                  Total Cost:
                </TableCell>
                <TableCell align="right">{totalModuleCost}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Paper>
    </div>
  );
}

render(<SelectableForm />, document.getElementById("root"));
