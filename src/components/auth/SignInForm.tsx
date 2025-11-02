import {FormEvent, useState} from "react";
import {Link, useNavigate} from "react-router";
import {EyeCloseIcon, EyeIcon} from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import {useLoginMutation} from "../../store/services/sessionApi.ts";

export default function SignInForm() {
    const navigate = useNavigate();
    const [login, {isLoading}] = useLoginMutation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        try {
            await login({email, password}).unwrap();
            navigate("/", {replace: true});
        } catch {
            setErrorMsg("Email və ya parol səhvdir");
        }
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Programa daxil olun!
                        </h1>
                    </div>
                    <div>
                        <div className="relative py-3 sm:py-5">
                            <div className="relative flex justify-center text-sm">
                            </div>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input
                                        placeholder="admin@demo.az"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                    />
                                </div>
                                <div>
                                    <Label>
                                        Parol <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Parol daxil edin"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                      {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5"/>
                      ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5"/>
                      )}
                    </span>
                                    </div>
                                </div>
                                {errorMsg && (
                                    <p className="text-sm text-red-500">{errorMsg}</p>
                                )}
                                <div className={"flex items-center justify-between"}>
                                    <div className="flex items-center gap-3">
                                        <Checkbox checked={isChecked} onChange={setIsChecked}/>
                                        <span
                                            className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                            Yadda saxla
                                         </span>
                                    </div>
                                    <Link
                                        to="/reset-password"
                                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                    >
                                        Parol yaddan çıxıb?
                                    </Link>
                                </div>
                                <div>
                                    <Button className="w-full" size="sm" type="submit" disabled={isLoading}>
                                        {isLoading ? "Giriş..." : "Daxil ol"}
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                        Demo:
                        <div>admin@demo.az / admin123</div>
                        <div>operator@demo.az / op123</div>
                        <div>supervisor@demo.az / sup123</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
