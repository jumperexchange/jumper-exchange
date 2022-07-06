import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react'

export interface ToSectionCarbonOffsetContextProps {
  beneficiaryAddress: string
  beneficiaryName: string
  retirementMessage: string
}
const initialInfo = {
  beneficiaryAddress: '',
  beneficiaryName: '',
  retirementMessage: '',
}

const ToSectionCarbonOffsetContext = createContext<ToSectionCarbonOffsetContextProps>(initialInfo)

const ToSectionCarbonOffsetUpdateContext = createContext<
  Dispatch<SetStateAction<ToSectionCarbonOffsetContextProps>>
>(() => {})

export const useBeneficiaryInfo = () => {
  return useContext(ToSectionCarbonOffsetContext)
}

export const useSetBeneficiaryInfo = () => {
  return useContext(ToSectionCarbonOffsetUpdateContext)
}

export const ToSectionCarbonOffsetProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [_beneficiaryInfo, _setBeneficiaryInfo] =
    useState<ToSectionCarbonOffsetContextProps>(initialInfo)

  return (
    <ToSectionCarbonOffsetContext.Provider value={_beneficiaryInfo}>
      <ToSectionCarbonOffsetUpdateContext.Provider value={_setBeneficiaryInfo}>
        {children}
      </ToSectionCarbonOffsetUpdateContext.Provider>
    </ToSectionCarbonOffsetContext.Provider>
  )
}
