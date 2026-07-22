import { useState } from "react";
import type { KeyboardEvent } from "react";

import {
  Emphasis,
  FlexBox,
  IconButton,
  Size,
  TextField,
  Theme,
  Thumbnail,
} from "@lumx/react";
import { mdiClose, mdiMagnify } from "@lumx/icons";

import styles from "./Header.module.scss";
import logo from "../../assets/logo.png";

interface HeaderProps {
  initialSearch: string;
  onSearch: (name: string) => void;
}

export const Header = ({ initialSearch, onSearch }: HeaderProps) => {
  const [committedSearch, setCommittedSearch] = useState(initialSearch);
  const [value, setValue] = useState(initialSearch);

  if (initialSearch !== committedSearch) {
    setCommittedSearch(initialSearch);
    setValue(initialSearch);
  }

  const commitSearch = (nextValue: string) => {
    if (nextValue !== committedSearch) {
      onSearch(nextValue);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      commitSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue("");
    commitSearch("");
  };

  return (
    <header className={styles.header}>
      <FlexBox
        className={styles.logo}
        orientation="horizontal"
        vAlign="space-between"
        hAlign="center"
        wrap
      >
        <Thumbnail
          image={logo}
          className={styles.logo}
          alt="My Static App Logo"
        />

        <TextField
          className={styles.search}
          theme={Theme.light}
          icon={mdiMagnify}
          value={value}
          onChange={setValue}
          onKeyDown={handleKeyDown}
          label="Search"
          afterElement={
            <IconButton
              icon={mdiClose}
              label="Clear search"
              emphasis={Emphasis.low}
              size={Size.s}
              onClick={handleClear}
            />
          }
        />
      </FlexBox>
    </header>
  );
};
