import { Button, withStyles } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
const CustomButton = withStyles((theme) => ({
  root: {
    width: "100%",
    height: "120px",
    fontSize: 28,
    padding: "6px 12px",
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  },
}))(Button);
export default CustomButton;
