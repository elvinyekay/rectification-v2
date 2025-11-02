import Button from "../../../components/ui/button/Button.tsx";
import {ComponentTabs} from "../../../components/common/ComponentTabs.tsx";
import ComponentTab from "../../../components/common/ComponentTab.tsx";
import VerifiableFieldEditable from "./VerifiableFieldEditable.tsx";

interface Props {
    isSubmitting: boolean;
}

const FormSide = ({isSubmitting}: Props) => {
    return (
        <div className="min-h-screen flex flex-col mx-2 my-2">
            <div className="flex-1 overflow-y-auto w-full p-2">
                <ComponentTabs>
                    <ComponentTab
                        value="f1"
                        label="1-ci Fəsil"
                    >
                        <div className="space-y-4 text-slate-700">
                            <ComponentTabs>
                                <ComponentTab value="sub-a" label="Əsas səhifə">
                                    <div className="space-y-3">
                                        <VerifiableFieldEditable
                                            label="test"
                                            originalValue="asasdsa"
                                            required
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Əmlakın reyestr nömrəsi  "
                                            originalValue="12saxw232"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Əvvəlki reyestr nömrəsi "
                                            originalValue="test tşkilat"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Əvvəlki reyestr tarixi"
                                            originalValue="123456"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Reyestr nömrəsi"
                                            originalValue="10.10.2010"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Reyestr tarixi "
                                            originalValue="12345"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Sonrakı reyestr nömrəsi"
                                            originalValue="12345"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Sonrakı reyestr tarixi"
                                            originalValue="12345"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Ad"
                                            originalValue="12345"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Ünvan"
                                            originalValue="12345"
                                            onChange={(v) => console.log(v)}
                                        />

                                    </div>
                                </ComponentTab>
                                <ComponentTab value="sub-b" label="Sənədlər-əsaslar">
                                    <div className="space-y-3">
                                        <VerifiableFieldEditable
                                            label="Sənədi adı"
                                            originalValue="12saxw232"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Sənədi verən təşkilat "
                                            originalValue="test tşkilat"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Sənədin nömrəsi"
                                            originalValue="123456"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Sənədin tarixi"
                                            originalValue="10.10.2010"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="İnventar nömrəsi"
                                            originalValue="12345"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Tərtib edilmə tarixi"
                                            originalValue="12345"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Özəl hüquqi şəxsin tam adı "
                                            originalValue="12345"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Bələdiyyədir barədə (seçimli qeyd)"
                                            originalValue="12345"
                                            onChange={(v) => console.log(v)}
                                        />
                                        <VerifiableFieldEditable
                                            label="Xarici ölkəyə məxsusdur barədə (seçimli qeyd)"
                                            originalValue="12345"
                                            onChange={(v) => console.log(v)}
                                        />

                                    </div>
                                </ComponentTab>
                                <ComponentTab value="sub-c" label="Məhdudiyyətlər">
                                    <VerifiableFieldEditable
                                        label="Əmlakın məhdudiyyət tətbiq edilən hissəsi"
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                    <VerifiableFieldEditable
                                        label="Məhdudiyyətin növü "
                                        originalValue="Rayon"
                                        onChange={(v) => console.log(v)}
                                    />
                                    <VerifiableFieldEditable
                                        label="Yüklülüyün növü"
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                    <VerifiableFieldEditable
                                        label="Başlama tarixi"
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                    <VerifiableFieldEditable
                                        label="Son tarix"
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                    <VerifiableFieldEditable
                                        label="Məhdudiyyətin müddəti"
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                    <VerifiableFieldEditable
                                        label="Digər ünvan "
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                    <VerifiableFieldEditable
                                        label="DƏQKİS nömrəsi"
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                    <VerifiableFieldEditable
                                        label="Əmlakın məhdudiyyət tətbiq edilən hissəsi"
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                    <VerifiableFieldEditable
                                        label="Ünvan"
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                </ComponentTab>
                                <ComponentTab value="sub-d" label="Arxiv">
                                    <VerifiableFieldEditable
                                        label="Ünvan"
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                </ComponentTab>
                                <ComponentTab value="sub-e" label="Passport">
                                    <VerifiableFieldEditable
                                        label="Ünvan"
                                        originalValue="12345"
                                        onChange={(v) => console.log(v)}
                                    />
                                </ComponentTab>
                            </ComponentTabs>
                        </div>
                    </ComponentTab>

                    <ComponentTab value="f2" label="2-ci Fəsil">
                        <ComponentTabs>
                            <ComponentTab value="sub-2-a" label="Verilmiş sənədlər">
                                <VerifiableFieldEditable
                                    label="Ünvan"
                                    originalValue="12345"
                                    onChange={(v) => console.log(v)}
                                />
                            </ComponentTab>
                            <ComponentTab value="sub-2-b" label="Hüquqlar">
                                <VerifiableFieldEditable
                                    label="Ünvan"
                                    originalValue="12345"
                                    onChange={(v) => console.log(v)}
                                />
                            </ComponentTab>
                            <ComponentTab value="sub-2-c" label="Fiziki ş-lər">
                                <VerifiableFieldEditable
                                    label="Ünvan"
                                    originalValue="12345"
                                    onChange={(v) => console.log(v)}
                                />
                            </ComponentTab>
                            <ComponentTab value="sub-2-d" label="Hüquqi -lər">
                                <VerifiableFieldEditable
                                    label="Ünvan"
                                    originalValue="12345"
                                    onChange={(v) => console.log(v)}
                                />
                            </ComponentTab>
                        </ComponentTabs>
                    </ComponentTab>

                    <ComponentTab value="f3" label="3-cü Fəsil">
                        <ComponentTabs>
                            <ComponentTab value="sub-3-a" label="Məhdudiyyətlər">
                                <VerifiableFieldEditable
                                    label="Ünvan"
                                    originalValue="12345"
                                    onChange={(v) => console.log(v)}
                                />
                            </ComponentTab>
                            <ComponentTab value="sub-3-b" label="Məlumatlar">
                                <VerifiableFieldEditable
                                    label="Ünvan"
                                    originalValue="12345"
                                    onChange={(v) => console.log(v)}
                                />
                            </ComponentTab>

                        </ComponentTabs>
                    </ComponentTab>
                </ComponentTabs>
            </div>


            <div
                className="mt-6 bg-white dark:bg-gray-900
             border-t border-gray-200 dark:border-gray-800
             p-4 flex gap-2 justify-end rounded-b-2xl"
            >
                <Button
                    variant="gradient"
                    color="cyan"
                    size="xs"
                    disabled={isSubmitting}
                >
                    Keç
                </Button>
                <Button
                    variant="gradient"
                    color="red"
                    size="xs"
                    disabled={isSubmitting}
                >
                    Rədd et
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    size="xs"
                    disabled={isSubmitting}
                >
                    Təsdiqlə & Növbəti
                </Button>
            </div>
        </div>
    );
};

export default FormSide;
