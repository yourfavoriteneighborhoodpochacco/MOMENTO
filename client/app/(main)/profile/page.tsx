"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    function handleSignOut() {
        signOut()
        router.push("/login")
    }

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                backgroundColor: "#FAFAF8",
                backdropFilter: "blur(12px)",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                padding: "40px 24px",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflowY: "auto",
                zIndex: 30
            }}>
                <p style={{ color: "#B0A898", letterSpacing: "0.08em" }}>Loading...</p>
            </div>
        )
    }

    if (!user) return null

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#FAFAF8",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            padding: "40px 24px"
        }}>
            <div style={{
                maxWidth: 480,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: 16
            }}>

                {/* Back to map */}
                <Link href="/map" style={{ textDecoration: "none" }}>
                    <p style={{
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#9C9086",
                        marginBottom: 8
                    }}>
                        ← Back to map
                    </p>
                </Link>

                {/* Avatar card */}
                <div style={{
                    backgroundColor: "#FAFAF8",
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
                }}>
                    {/* Banner */}
                    <div style={{
                        height: 80,
                        background: "linear-gradient(135deg, #DDD9D0 0%, #C8C4BA 50%, #D4D0C8 100%)"
                    }} />

                    {/* Avatar + name */}
                    <div style={{ padding: "0 24px 24px", marginTop: -28 }}>
                        <div style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            backgroundColor: "#7A5F55",
                            border: "3px solid #FAFAF8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 12
                        }}>
                            <span style={{
                                fontSize: 22,
                                fontWeight: 600,
                                color: "#ECF0F1"
                            }}>
                                {user.first_name.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        <h2 style={{
                            fontSize: 22,
                            fontWeight: 600,
                            color: "#262626",
                            marginBottom: 2
                        }}>
                            {user.first_name}
                        </h2>
                        <p style={{
                            fontSize: 12,
                            color: "#9C9086",
                            letterSpacing: "0.04em",
                            marginBottom: 12
                        }}>
                            @{user.username}
                        </p>

                        {/* Account type badge */}
                        <div style={{
                            display: "inline-block",
                            backgroundColor: user.account_type === "contributor" ? "#F0EDE8" : "#F0EDE8",
                            borderRadius: 8,
                            padding: "4px 10px"
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
                    </div>
                </div>

                {/* Details card */}
                <div style={{
                    backgroundColor: "#FAFAF8",
                    borderRadius: 20,
                    padding: "24px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
                }}>
                    <p style={{
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#B0A898",
                        marginBottom: 18
                    }}>
                        Account details
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 13, color: "#7A7570" }}>Email</span>
                            <span style={{ fontSize: 13, color: "#262626" }}>{user.email}</span>
                        </div>

                        {user.location && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 13, color: "#7A7570" }}>Area</span>
                                <span style={{ fontSize: 13, color: "#262626" }}>{user.location}</span>
                            </div>
                        )}

                        {user.phone_number && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 13, color: "#7A7570" }}>Phone</span>
                                <span style={{ fontSize: 13, color: "#262626" }}>{user.phone_number}</span>
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 13, color: "#7A7570" }}>Member since</span>
                            <span style={{ fontSize: 13, color: "#262626" }}>
                                {new Date(user.member_since).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric"
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notifications card */}
                <div style={{
                    backgroundColor: "#FAFAF8",
                    borderRadius: 20,
                    padding: "24px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
                }}>
                    <p style={{
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#B0A898",
                        marginBottom: 18
                    }}>
                        Notifications
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <p style={{ fontSize: 13, color: "#262626", marginBottom: 2 }}>SMS notifications</p>
                                <p style={{ fontSize: 11, color: "#B0A898" }}>Application updates via text</p>
                            </div>
                            <div style={{
                                width: 40,
                                height: 22,
                                borderRadius: 11,
                                backgroundColor: user.sms_notifications ? "#7A5F55" : "#D4D0C8",
                                position: "relative",
                                opacity: 0.7
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: 3,
                                    left: user.sms_notifications ? 21 : 3,
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                                }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <p style={{ fontSize: 13, color: "#262626", marginBottom: 2 }}>Availability alerts</p>
                                <p style={{ fontSize: 11, color: "#B0A898" }}>Text me when a saved spot clears up</p>
                            </div>
                            <div style={{
                                width: 40,
                                height: 22,
                                borderRadius: 11,
                                backgroundColor: user.availability_alerts ? "#7A5F55" : "#D4D0C8",
                                position: "relative",
                                opacity: 0.7
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: 3,
                                    left: user.availability_alerts ? 21 : 3,
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: "white",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                                }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contributor status card */}
                {user.account_type !== "contributor" && (
                    <div style={{
                        backgroundColor: "#FAFAF8",
                        borderRadius: 20,
                        padding: "24px",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
                    }}>
                        <p style={{
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "#B0A898",
                            marginBottom: 12
                        }}>
                            Become a contributor
                        </p>
                        <p style={{
                            fontSize: 13,
                            color: "#7A7570",
                            lineHeight: 1.6,
                            marginBottom: 16
                        }}>
                            Contributors can submit real-time crowd reports and help the community find available spaces.
                        </p>

                        {user.status === "pending" ? (
                            <div style={{
                                backgroundColor: "#F0EDE8",
                                borderRadius: 10,
                                padding: "10px 14px"
                            }}>
                                <p style={{
                                    fontSize: 12,
                                    color: "#9C9086",
                                    letterSpacing: "0.04em"
                                }}>
                                    Your application is under review
                                </p>
                            </div>
                        ) : (
                            <Link href="/apply" style={{ textDecoration: "none" }}>
                                <div style={{
                                    backgroundColor: "#7A5F55",
                                    borderRadius: 10,
                                    padding: "11px 16px",
                                    display: "inline-block",
                                    cursor: "pointer"
                                }}>
                                    <span style={{
                                        fontSize: 12,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        color: "#ECF0F1"
                                    }}>
                                        Apply to contribute
                                    </span>
                                </div>
                            </Link>
                        )}
                    </div>
                )}

                {/* Sign out */}
                <div style={{
                    backgroundColor: "#FAFAF8",
                    borderRadius: 20,
                    padding: "20px 24px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
                }}>
                    <button
                        onClick={handleSignOut}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: 13,
                            letterSpacing: "0.06em",
                            color: "#C0786A",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            padding: 0
                        }}
                    >
                        Sign out
                    </button>
                </div>

            </div>
        </div>
    )
}