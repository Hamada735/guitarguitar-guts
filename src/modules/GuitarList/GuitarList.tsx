import {
  CircularProgress,
  Container,
  Card,
  CardContent,
  CardMedia,
  Box,
  Grid,
  Typography,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Alert
} from "@mui/material";
import { inject, observer } from "mobx-react";
import React from "react";
import { IGuitar } from "../../models/IGuitar";
import { GuitarListStore } from "./GuitarListStore";

interface IProps {
  GuitarListStore?: GuitarListStore;
}

@inject("GuitarListStore")
@observer
export class GuitarList extends React.Component<IProps> {
  private listStore: GuitarListStore;

  constructor(props: IProps) {
    super(props);
    this.listStore = this.props.GuitarListStore!;
  }

  render() {
    return (
      <Container>
        {this.listStore.loading ? (
          <CircularProgress />
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
              <FormControl sx={{ width: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={this.listStore.filters.category}
                  label="Category"
                  onChange={(e) =>
                    this.listStore.setFilter(
                      "category",
                      e.target.value as string
                    )
                  }
                >
                  {[
                    { text: "Electric", value: "GUEG" },
                    { text: "Acoustic", value: "GUAG" },
                    { text: "Bass", value: "GUBG" },
                  ].map((item) => (
                    <MenuItem value={item.value}>{item.text}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {this.listStore.filteredGuitars?.length > 0 ? (
              <>
                <Grid container spacing={2}>
                  {this.listStore.pageOfGuitarsFiltered.map((guitar) => (
                    <Grid item xs={4}>
                      <GuitarListItem guitar={guitar} />
                    </Grid>
                  ))}
                </Grid>
                <Box
                  sx={{ display: "flex", justifyContent: "center", padding: 3 }}
                >
                  <Pagination
                    count={this.listStore.pageCountFiltered}
                    color="primary"
                    page={this.listStore.page}
                    onChange={(_e, p) => this.listStore.setPage(p)}
                  />
                </Box>
              </>
            ) : (
              <Alert severity="error">No guitars matches the criteria!</Alert>
            )}
          </>
        )}
      </Container>
    );
  }
}

class GuitarListItem extends React.Component<{ guitar: IGuitar }> {
  render() {
    const { guitar } = this.props;
    const card = (
      <Card sx={{ display: "flex", height: 200, width: "100%" }}>
        <CardMedia
          component="img"
          height={200}
          image={guitar.pictureMain}
          alt={guitar.itemName}
          sx={{ height: 200, width: 100, objectFit: "contain" }}
          style={{ padding: 10 }}
        />
        <Box>
          <CardContent>
            <Typography variant="h6">{guitar.itemName}</Typography>
            <Typography variant="h5" color="text.secondary">
              £{guitar.salesPrice}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    );

    const needsBadge: boolean = guitar.salesPrice < 500;

    return needsBadge ? (
      <Badge color="primary" badgeContent="Cheap!" sx={{ display: "flex" }}>
        {card}
      </Badge>
    ) : (
      card
    );
  }
}
