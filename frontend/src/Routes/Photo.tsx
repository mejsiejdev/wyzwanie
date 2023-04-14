import { useState } from "react";
import { MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Photo = () => {
  const navigate = useNavigate();
  const reader = new FileReader();
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>();

  reader.onloadend = () => {
    setPreview(reader.result?.toString());
  };

  const addPhoto = async () => {
    setLoading(true);
    fetch("http://localhost:8000/user/photo", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("JWT")}`,
      },
      body: JSON.stringify({
        photo: preview,
      }),
    }).then((response) => {
      if (response.ok) {
        navigate("/");
      } else {
        if (response.status === 401) {
          navigate("/signin");
        }
        if (response.status === 500) {
          // TODO: Add some sort of error modal
          console.log("Something went horribly wrong...");
        }
      }
    });
    setLoading(false);
  };

  return (
    <div
      className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
      style={{ maxWidth: "28rem" }}>
      <div className="d-flex flex-column gap-3 w-100">
        <p className="fs-1 fw-semibold mb-0">
          {!preview ? "You are in! Add your profile photo!" : "You are now ready to go!"}
        </p>
        {!preview && <p>It will make it easier for your friends to recognize you.</p>}
        {preview ? (
          <img
            src={preview}
            alt="Image preview"
            width={256}
            height={256}
            className="rounded-circle align-self-center object-fit-cover"
          />
        ) : (
          <div
            className="bg-light rounded-circle align-self-center d-flex align-items-center p-3"
            style={{ width: "16rem", height: "16rem" }}>
            <MdPerson className="text-secondary" style={{ width: "24rem", height: "24rem" }} />
          </div>
        )}
        <div className="d-flex flex-column gap-2">
          {!loading && (
            <label className="btn btn-primary fw-semibold w-100">
              {!preview ? "Upload" : "Change"}
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="d-none"
                onChange={(e) => {
                  if (e.target.files !== null) {
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                required
              />
            </label>
          )}
          {preview && (
            <button
              type="submit"
              className="btn btn-success fw-semibold w-100"
              onClick={addPhoto}
              disabled={loading}>
              {loading ? "Loading..." : "Next"}
            </button>
          )}
        </div>
        {!preview && (
          <a
            href="/"
            className="btn btn-light text-center fw-semibold text-secondary text-decoration-none">
            Skip
          </a>
        )}
      </div>
    </div>
  );
};

export default Photo;
