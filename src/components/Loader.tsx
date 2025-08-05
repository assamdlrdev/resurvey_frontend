
import type React from "react";
import type { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

const override: CSSProperties = {
    // position: "absolute",
    // display: "block",
    // margin: "0 auto",
    // borderColor: "red"
    borderWidth: "10px"
};

interface Props {
    loading: boolean
};

const Loader: React.FC<Props> = ({loading}) => {
    return (
        <>
            {loading && <div className="fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center z-50">
                <ClipLoader
                    color="#e22525ff"
                    loading={loading}
                    cssOverride={override}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>}
        </>
    );
};

export default Loader;
