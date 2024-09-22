export interface AsyncSlice<D> {
  loading: boolean;
  data: D | undefined;
  error: Error | undefined;
}

export interface LoadingSlice<D> extends AsyncSlice<D> {
  loading: true;
  data: undefined;
  error: undefined;
}

export interface LoadedSlice<D> extends AsyncSlice<D> {
  loading: false;
  data: D;
  error: undefined;
}

export interface FailedSlice<D> extends AsyncSlice<D> {
  loading: false;
  data: undefined;
  error: Error;
}
