export type ImagesJson = {
  directories: string[];
  img: {
    [key: string]: GalleryImageData[];
  };
};

export type GalleryImageData = {
  title: string;
  caption: string;
  img_src: string;
  placeholder_src: string;
  lastModified: string;
};

export type GalleryRouteQueryParams = {
  folder: string;
};
