import { FlexBox, Thumbnail, TextField, Theme } from "@lumx/react";
import { mdiMagnify } from "@lumx/icons";

import styles from "./Header.module.scss";
import logo from "../../assets/logo.png";

export const Header = () => {
  return (
    <header className={styles.header}>
      <FlexBox
        className={styles.logo}
        orientation="horizontal"
        vAlign="space-between"
        hAlign="center"
      >
        <Thumbnail
          image={logo}
          className={styles.logo}
          alt="My Static App Logo"
        />

        <TextField
          theme={Theme.light}
          icon={mdiMagnify}
          onChange={() => {}}
          label="Search"
        />
      </FlexBox>
    </header>
  );
};
