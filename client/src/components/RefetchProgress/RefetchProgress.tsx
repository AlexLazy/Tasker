import { FC } from "react";
import { NetworkStatus } from "@apollo/client";
import {
  LinearProgress,
  createStyles,
  Theme,
  withStyles,
} from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";

const CustomLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "fixed",
      width: "100%",
      bottom: theme.spacing(7),
    },
    colorPrimary: {
      backgroundColor: green[500],
    },
    bar: {
      backgroundColor: grey[500],
    },
  })
)(LinearProgress);

interface RefetchProgressProps {
  networkStatus: NetworkStatus;
}

const RefetchProgress: FC<RefetchProgressProps> = ({ networkStatus }) =>
  networkStatus === NetworkStatus.refetch ? <CustomLinearProgress /> : null;

export const useRefetch = (loading: boolean, networkStatus: NetworkStatus) =>
  loading && networkStatus !== NetworkStatus.refetch;

export default RefetchProgress;
