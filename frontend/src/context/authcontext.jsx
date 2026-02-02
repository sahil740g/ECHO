import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({});
const API_URL = import.meta.env.VITE_SOCKET_URL ? import.meta.env.VITE_SOCKET_URL.replace('wss://', 'https://').replace('ws://', 'http://') : "http://localhost:3001";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            console.warn("Token expired, clearing session");
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false);
            return;
          }

          // Verify token with backend
          const { data } = await axios.get(`${API_URL}/verify`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (data.user) {
            console.log("Session verified via backend");
            // Set global header for future requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await fetchUserData(data.user);
          } else {
            throw new Error("No user data in verify response");
          }
        } catch (error) {
          console.error("Session verification failed:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        // Fallback: Check Supabase session (legacy/optional)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserData(session.user);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserSession();
  }, []);

  // ... fetchUserData is here (unchanged) ...

  // Note: We need to keep this function inside the component scope or move it out if it doesn't use state. 
  // But since I am editing the file content using replace, I will assume fetchUserData is preserved if I don't touch it. 
  // Wait, I am NOT replacing fetchUserData. I'm selecting ranges.

  // I will replace from start of file to line 37 (useEffect end) 
  // AND `loginWithEmail` and `logout`.

  // Actually, I can do this in one `replace_file_content` if I include `fetchUserData` in the replacement? 
  // No, `fetchUserData` is large. I should use `multi_replace` or specific range.
  // The tool `replace_file_content` replaces a SINGLE contiguous block.
  // `loginWithEmail` and `logout` are further down. `useEffect` is at the top.
  // I will use `replace_file_content` for `useEffect` first? Or `multi_replace`.
  // I'll use `multi_replace_file_content` to be safe and precise.


  const fetchUserData = async (authUser) => {
    try {
      // Fetch profile
      let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
      }

      // If profile is missing, create it from auth metadata
      if (!profile && authUser.user_metadata) {
        const { full_name, avatar_url, user_name, preferred_username } =
          authUser.user_metadata;
        const newProfile = {
          id: authUser.id,
          name: full_name || authUser.email.split("@")[0],
          handle:
            user_name ||
            preferred_username ||
            `@${authUser.email.split("@")[0]}`,
          avatar_url: avatar_url,
          // bio: "New user",
        };

        // Ensure handle starts with @
        if (newProfile.handle && !newProfile.handle.startsWith("@")) {
          newProfile.handle = "@" + newProfile.handle;
        }

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .upsert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
        } else {
          profile = createdProfile;
        }
      }

      // Fetch bookmarks (saved posts)
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from("bookmarks")
        .select("post_id")
        .eq("user_id", authUser.id);

      if (bookmarksError)
        console.error("Error fetching bookmarks:", bookmarksError);

      // Fetch following
      const { data: following, error: followingError } = await supabase
        .from("follows")
        .select("following_id, profiles!follows_following_id_fkey(handle)")
        .eq("follower_id", authUser.id);

      if (followingError)
        console.error("Error fetching following:", followingError);

      const savedPosts = bookmarks ? bookmarks.map((b) => b.post_id) : [];
      const followingHandles = following
        ? following.map((f) => f.profiles.handle)
        : [];

      // If profile doesn't conflict, use auth metadata for fallback
      const finalUser = {
        id: authUser.id,
        email: authUser.email,
        ...profile,
        name:
          profile?.name ||
          authUser.user_metadata?.full_name ||
          authUser.email.split("@")[0],
        handle: profile?.handle || `@${authUser.email.split("@")[0]}`,
        avatar: profile?.avatar_url || authUser.user_metadata?.avatar_url,
        savedPosts,
        following: followingHandles,
      };

      setUser(finalUser);
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithProvider = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase(),
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Login error:", error.message);
      return { error };
    }
  };

  const signUpWithEmail = async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            user_name: email.split("@")[0],
          },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Signup error:", error.message);
      return { data: null, error };
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      // Use backend for login
      const { data } = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        // Set global header
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        // Use the user data from backend to fetch profile
        if (data.user) {
          await fetchUserData(data.user);
        }
        return { data: data.user, error: null };
      } else {
        throw new Error("No token returned from backend");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data?.error || error.message);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  };

  const logout = async () => {
    try {
      // Clear local persistence
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];

      // Optional: Sign out from Supabase too (to clear implicit session)
      await supabase.auth.signOut();

      await supabase.auth.signOut();

      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const uploadImage = async (userId, fileData, bucket = "images") => {
    try {
      // expect fileData to be base64 string: "data:image/jpeg;base64,..."
      if (!fileData || !fileData.startsWith("data:")) return fileData;

      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}.jpg`;

      // Convert base64 to blob
      const res = await fetch(fileData);
      const blob = await res.blob();

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const updateUser = async (userData) => {
    if (!user) return;
    try {
      console.log("Updating user with data:", userData);
      let updates = { ...userData };

      // Handle Image Uploads
      if (updates.avatar && updates.avatar.startsWith("data:")) {
        console.log("Uploading avatar...");
        try {
          updates.avatar_url = await uploadImage(user.id, updates.avatar);
          console.log("Avatar uploaded successfully:", updates.avatar_url);
        } catch (err) {
          console.error("Failed to upload avatar:", err);
          alert(
            "Failed to upload avatar image. Please try a smaller image or different format.",
          );
          return;
        }
        delete updates.avatar;
      }

      if (updates.coverImage && updates.coverImage.startsWith("data:")) {
        console.log("Uploading cover image...");
        try {
          updates.cover_url = await uploadImage(user.id, updates.coverImage);
          console.log("Cover image uploaded successfully:", updates.cover_url);
        } catch (err) {
          console.error("Failed to upload cover image:", err);
          alert(
            "Failed to upload cover image. Please try a smaller image or different format.",
          );
          return;
        }
        delete updates.coverImage;
      }

      // Clean up for DB insert (remove UI-specific fields if mapped)
      // Schema expects: id, name, bio, location, website, avatar_url, cover_url, handle
      const dbData = {
        id: user.id,
        name: updates.name,
        bio: updates.bio,
        location: updates.location,
        website: updates.website,
        avatar_url: updates.avatar_url || user.avatar_url || user.avatar, // fallback
        cover_url: updates.cover_url || user.cover_url || user.coverImage, // fallback
        // handle is usually not editable or handled separately, but let's include if passed
        handle: updates.handle,
      };

      console.log("Saving to Supabase profiles:", dbData);

      const { error } = await supabase.from("profiles").upsert(dbData);

      if (error) {
        console.error("Supabase upsert error:", error);
        throw error;
      }

      // Update local state with the new URLs and data
      // We map avatar_url -> avatar and cover_url -> coverImage for the frontend apps usage if consistent
      setUser((prev) => ({
        ...prev,
        ...updates,
        avatar: updates.avatar_url || prev.avatar,
        coverImage: updates.cover_url || prev.coverImage,
      }));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert(
        `Failed to update profile: ${error.message || error.error_description || "Unknown error"}`,
      );
    }
  };

  const toggleBookmark = async (postId) => {
    if (!user) {
      openLoginModal();
      return;
    }

    const isSaved = user.savedPosts.includes(postId);
    let newSavedPosts;

    try {
      if (isSaved) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
        if (error) throw error;
        newSavedPosts = user.savedPosts.filter((id) => id !== postId);
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, post_id: postId });
        if (error) throw error;
        newSavedPosts = [...user.savedPosts, postId];
      }

      setUser((prev) => ({ ...prev, savedPosts: newSavedPosts }));
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const toggleFollow = async (handle) => {
    if (!user) {
      openLoginModal();
      return;
    }

    const isFollowing = user.following.includes(handle);
    let newFollowing;

    try {
      // First get the user_id for the handle
      const { data: targetUser, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("handle", handle)
        .single();

      if (fetchError || !targetUser) {
        console.error("User not found to follow");
        return;
      }

      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", targetUser.id);
        if (error) throw error;
        newFollowing = user.following.filter((h) => h !== handle);
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: user.id, following_id: targetUser.id });
        if (error) throw error;
        newFollowing = [...user.following, handle];
      }

      setUser((prev) => ({ ...prev, following: newFollowing }));
      return { action: isFollowing ? 'unfollowed' : 'followed', targetId: targetUser.id };
    } catch (error) {
      console.error("Error toggling follow:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithProvider,
        signUpWithEmail,
        loginWithEmail,
        logout,
        updateUser,
        toggleBookmark,
        toggleFollow,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
