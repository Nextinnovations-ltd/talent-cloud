import SyncLoader from 'react-spinners/SyncLoader'

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  

export const PageInitialLoading = () => {
  return (
    <div className="flex items-center  h-[50vh] justify-start gap-3">
    <SyncLoader
      color={'#95a5a6'}
      loading={true}
      cssOverride={override}
      size={8}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>
  )
}
