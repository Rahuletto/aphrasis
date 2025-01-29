import { useSession } from "@clerk/nextjs";

type SessionType = ReturnType<typeof useSession>["session"];

type UserData = {
  name: string;
  streak: number;
  level_completed: number;
};

export const fetchUserData = async (uuid: string): Promise<UserData> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API}/api/user/${uuid}`;

  console.log("Fetching user data from:", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Fetched user data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const updateUserInBackend = async (
  session: NonNullable<SessionType>
) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API}/api/user`;

  // Simplify the payload to match exactly what the endpoint expects
  const payload = {
    uuid: session.id,
    name:
      session.user.fullName ||
      `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim(),
  };

  console.log("Making request to:", apiUrl);
  console.log("With payload:", payload);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    // Log raw response
    const rawResponse = await response.text();
    console.log("Raw response:", rawResponse);

    if (!response.ok) {
      throw new Error(
        `Failed to update user in backend: ${response.status} ${response.statusText}`
      );
    }

    // Parse the response only if it's JSON
    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (e) {
      console.log("Response was not JSON:", rawResponse);
      throw new Error("Invalid JSON response from server");
    }

    console.log("Parsed response data:", data);
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
