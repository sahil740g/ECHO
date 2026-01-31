import { supabase } from "./supabase";

export const searchUsers = async (query) => {
    if (!query) return [];

    console.log("Searching users for:", query);
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('name, handle, avatar_url')
            .or(`name.ilike.%${query}%,handle.ilike.%${query}%`)
            .limit(5);

        if (error) {
            console.error("Error searching users:", error);
            return [];
        }

        console.log("Found users:", data?.length);
        return data.map(user => ({
            name: user.name,
            handle: user.handle,
            avatar: user.avatar_url
        }));
    } catch (error) {
        console.error("Unexpected error searching users:", error);
        return [];
    }
};

export const getUserByHandle = async (handle) => {
    if (!handle) return null;
    // Remove @ if present
    const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name, handle, avatar_url')
            .ilike('handle', cleanHandle)
            .single();

        if (error) {
            console.error("Error fetching user by handle:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Unexpected error fetching user:", error);
        return null;
    }
};
