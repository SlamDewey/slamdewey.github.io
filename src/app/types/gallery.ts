export type ImageJson = {
  img_path: string;
  placeholder_path: string;
  directories: string[];
  img: {
    [key: string]: GalleryImageData[];
  };
};

export type GalleryImageData = {
  title: string;
  caption: string;
  lastModified: string;
  img_src: string;
  placeholder_src: string;
};

export type GalleryRouteQueryParams = {
  folder: string;
};
