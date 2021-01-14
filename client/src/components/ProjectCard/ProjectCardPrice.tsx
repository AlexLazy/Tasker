import React, { FC } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Avatar, Chip } from "@material-ui/core";
import CakeIcon from "@material-ui/icons/Cake";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";

export interface ProjectCardPriceProps {
  owner: boolean;
  price: number;
  priceTotal: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    priceWrapper: {
      display: "flex",
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    price: {
      marginLeft: theme.spacing(1),
    },
  })
);

const format = (num: number) => new Intl.NumberFormat("ru").format(num);

const ProjectCardPrice: FC<ProjectCardPriceProps> = ({
  owner,
  price,
  priceTotal,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.priceWrapper}>
      {owner && (
        <Chip
          size="small"
          label={format(priceTotal)}
          avatar={
            <Avatar>
              <BusinessCenterIcon />
            </Avatar>
          }
        />
      )}
      <Chip
        className={classes.price}
        size="small"
        color="primary"
        label={format(price)}
        avatar={
          <Avatar>
            <CakeIcon />
          </Avatar>
        }
      />
    </div>
  );
};
export default ProjectCardPrice;
