import { useLoginwithGoogleMutation } from "@/api/userApi";
import { create } from "@/app/actions";
import { auth, provider } from "@/lib/firebase";
import { useAppDispatch } from "@/lib/hooks";
import { loginSuccess } from "@/reducer/authReducer";
import { signInWithRedirect } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Button } from "./ui/button";
export default function LogInWithGoogle() {
  const [loginwithGoogle, { isLoading: RegisterLoading }] =
    useLoginwithGoogleMutation();
  const dispatch = useAppDispatch();
  const navigation = useRouter();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithRedirect(auth, provider);

      const user: {
        email?: string;
        username?: string;
        id: string;
        profilePic?: string;
        password?: string;
      } = {
        email: result.user.email || undefined,
        username: result.user.displayName || undefined,
        id: result.user.uid,
        profilePic: result.user.photoURL || undefined,
        password: "google",
      };
      const response = await loginwithGoogle(user).unwrap();
      if (response) {
        create({
          token: response.token,
          user: {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
          },
        });
        dispatch(loginSuccess(response.user));
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Login successful",
        });
        navigation.push("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid email or password",
        });
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
      console.error("Google login error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center py-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={RegisterLoading}
        onClick={handleGoogleLogin}
      >
        <Image
          src="/icons8-google.svg"
          alt="Google Icon"
          width={20}
          height={20}
          className="mr-2"
        />
        Sign up with Google
      </Button>
    </div>
  );
}
