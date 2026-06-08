"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function NavBar() {
    const { user, signOut } = useAuth()
    const router = useRouter()

    function handleSignOut() {
        signOut()
        router.push("/login")
    }

    return (
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            zIndex: 20,
            pointerEvents: "none"
        }}>

            {/* Logo */}
            <div style={{
                backgroundColor: "#FAFAF8",
                borderRadius: 12,
                padding: "8px 16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                pointerEvents: "all"
            }}>
                <Link href="/map" style={{ textDecoration: "none" }}>
                    <span style={{
                        fontSize: 18,
                        fontWeight: 500,
                        color: "#7A5F55",
                        letterSpacing: "0.08em",
                        fontFamily: "var(--font-cormorant), Georgia, serif"
                    }}>
                        momento
                    </span>
                </Link>
            </div>

            {/* Right side */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                pointerEvents: "all"
            }}>
                {user ? (
                    <>
                        {/* Account type badge */}
                        <div style={{
                            backgroundColor: "#FAFAF8",
                            borderRadius: 10,
                            padding: "6px 12px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
                        }}>
                            <span style={{
                                fontSize: 10,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: user.account_type === "contributor" ? "#7A5F55" : "#B0A898"
                            }}>
                                {user.account_type}
                            </span>
                        </div>

                        {user.account_type === "admin" && (
                            <Link href="/admin" style={{ textDecoration: "none" }}>
                                <div style={{
                                    backgroundColor: "#FAFAF8",
                                    borderRadius: 10,
                                    padding: "6px 12px",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
                                }}>
                                    <span style={{
                                        fontSize: 10,
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: "#7A5F55"
                                    }}>
                                        Dashboard
                                    </span>
                                </div>
                            </Link>
                        )}

                        {/* Profile button */}
                        <Link href="/profile" style={{ textDecoration: "none" }}>
                            <div style={{
                                backgroundColor: "#FAFAF8",
                                borderRadius: "50%",
                                width: 38,
                                height: 38,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                                cursor: "pointer"
                            }}>
                                <span style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#7A5F55",
                                    fontFamily: "var(--font-cormorant), Georgia, serif"
                                }}>
                                    {user.first_name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{ textDecoration: "none" }}>
                            <div style={{
                                backgroundColor: "#FAFAF8",
                                borderRadius: 10,
                                padding: "8px 16px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                                cursor: "pointer"
                            }}>
                                <span style={{
                                    fontSize: 12,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#7A5F55"
                                }}>
                                    Sign in
                                </span>
                            </div>
                        </Link>

                        <Link href="/register" style={{ textDecoration: "none" }}>
                            <div style={{
                                backgroundColor: "#7A5F55",
                                borderRadius: 10,
                                padding: "8px 16px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                                cursor: "pointer"
                            }}>
                                <span style={{
                                    fontSize: 12,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#ECF0F1"
                                }}>
                                    Register
                                </span>
                            </div>
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}