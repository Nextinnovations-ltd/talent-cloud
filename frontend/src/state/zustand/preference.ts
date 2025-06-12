import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type State = {
    selectedLanguage: string | undefined
}

type Actions = {
    setLanguage: (language: string) => void
}

const usePreferenceState = create<State & Actions>()(
    devtools(
        persist(
            (set) => ({
                //state
                selectedLanguage: undefined,

                //actions
                setLanguage: (language: string) =>
                    set({ selectedLanguage: language }),
            }),
            { name: 'PreferenceStore' },
        ),
    ),
)

export default usePreferenceState
