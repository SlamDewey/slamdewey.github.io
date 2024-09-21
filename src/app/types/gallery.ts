export type ImageJson = {
  img_path: string;
  placeholder_path: string;
  directories: string[];
  img: {
    [key: string]: Image[];
  };
};

export type Image = {
  title: string;
  caption: string;
  lastModified: string;
  img_src: string;
  placeholder_src: string;
};
