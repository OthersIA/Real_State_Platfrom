import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import Swal from "sweetalert2";
import LoadingFallback from "../../../components/shared/LoadingFallback";

const ManageProperties = () => {
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["manage-properties"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties`);
      return res.data;
    },
  });

  const verifyProperty = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`${import.meta.env.VITE_API_URL}/properties/verify/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Verified!", "Property has been verified.", "success");
      queryClient.invalidateQueries(["manage-properties"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to verify property.", "error");
    },
  });

  const rejectProperty = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`${import.meta.env.VITE_API_URL}/properties/reject/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Rejected!", "Property has been rejected.", "success");
      queryClient.invalidateQueries(["manage-properties"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to reject property.", "error");
    },
  });

  const deleteProperty = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/properties/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Property has been deleted.", "success");
      queryClient.invalidateQueries(["manage-properties"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete property.", "error");
    },
  });

  if (isLoading) return <LoadingFallback />;

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#00BBA7]">Manage Properties</h2>
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            <th>#</th>
            <th>Title</th>
            <th>Location</th>
            <th>Agent Name</th>
            <th>Agent Email</th>
            <th>Price Range</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((prop, idx) => (
            <tr key={prop._id}>
              <td>{idx + 1}</td>
              <td>{prop.title}</td>
              <td>{prop.location}</td>
              <td>{prop.agentName}</td>
              <td>{prop.agentEmail}</td>
              <td>
                ${prop.minPrice} - ${prop.maxPrice}
              </td>
              <td>
                {prop.verificationStatus === "verified" && (
                  <span className="badge bg-[#00BBA7] text-white">Verified</span>
                )}
                {prop.verificationStatus === "rejected" && (
                  <span className="badge bg-red-500 text-white">Rejected</span>
                )}
                {!prop.verificationStatus || prop.verificationStatus === "pending" ? (
                  <span className="badge bg-yellow-500 text-white">Pending</span>
                ) : null}
              </td>
              <td className="flex flex-wrap gap-2">
                <Link
                  to={`/property/${prop._id}`}
                  className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition"
                >
                  Property Details
                </Link>

                {(!prop.verificationStatus || prop.verificationStatus === "pending") && (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        verifyProperty.mutate(prop._id);
                      }}
                      className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition"
                    >
                      Verify
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        rejectProperty.mutate(prop._id);
                      }}
                      className="btn btn-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      Reject
                    </button>
                  </>
                )}

                {(prop.verificationStatus === "verified" ||
                  prop.verificationStatus === "rejected") && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      Swal.fire({
                        title: "Delete?",
                        text: "This property will be removed permanently.",
                        icon: "warning",
                        showCancelButton: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteProperty.mutate(prop._id);
                        }
                      });
                    }}
                    className="btn btn-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProperties;
