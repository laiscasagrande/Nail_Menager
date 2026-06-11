import { createContext, useContext, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../theme/themes";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [selectedTheme, setSelectedTheme] = useState('light')

    const theme = selectedTheme === 'light' ? lightTheme : darkTheme

    async function handleSavePreferencesTheme() {
        const user = auth.currentUser;
        if (!user) return

        try {
            await setDoc(doc(db, 'users', user.uid), {
                theme: selectedTheme
            }, { merge: true })
        } catch (error) {
            console.log("error: ", error);
        }
    }

    async function loadTheme() {
        const user = auth.currentUser;
        if (!user) return

        try {
            const docSnap = await getDoc(doc(db, 'users', user.uid))
            const data = docSnap.data()?.theme

            if (data) {
                setSelectedTheme(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;
            try {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                const savedTheme = docSnap.data()?.theme;
                if (savedTheme) {
                    setSelectedTheme(savedTheme);
                }
            } catch (error) {
                console.log(error);
            }
        });
        return unsubscribe;
    }, []);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                selectedTheme,
                setSelectedTheme,
                handleSavePreferencesTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext);
}