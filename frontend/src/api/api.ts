
export const API_BASE_URL = "http://localhost:8888";

export const handleDelete = async (id: string, type: "admin" | "student" | "class-record") => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-${type}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Item successfully deleted from the database
      console.log(`${type} with ID ${id} deleted successfully.`);
    } else {
      // Failed to delete item from the database
      console.error(`Failed to delete ${type} with ID ${id}.`);
    }
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error(
      `An error occurred while deleting ${type} with ID ${id}.`,
      error
    );
  }
}
