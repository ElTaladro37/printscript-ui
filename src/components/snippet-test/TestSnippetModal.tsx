import {Box,  Divider, IconButton, Tab, Tabs, Typography} from "@mui/material";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {SyntheticEvent, useEffect, useState} from "react";
import {AddRounded} from "@mui/icons-material";
import {useGetTestCases, usePostTestCase, useRemoveTestCase} from "../../utils/queries.tsx";
import {TabPanel} from "./TabPanel.tsx";
import {queryClient} from "../../App.tsx";
import { TestCase } from "../../types/TestCase.ts";

type TestSnippetModalProps = {
    open: boolean
    onClose: () => void
    snippetId: string;
}

export const TestSnippetModal = ({open, onClose, snippetId}: TestSnippetModalProps) => {
    const [value, setValue] = useState(0);

    const [testCases, setTestCases] = useState<TestCase[]>([]);
    //const testCasesArray = Array.isArray(testCases) ? testCases : [];
    //console.log(testCasesArray);
    const {data} = useGetTestCases(snippetId);
    const {mutateAsync: postTestCase} = usePostTestCase();
    const {mutateAsync: removeTestCase} = useRemoveTestCase({
        onSuccess: () => queryClient.invalidateQueries('testCases')
    });

    useEffect(() => {
        if (Array.isArray(data) ) {
            setTestCases(data);
            console.log(data);
        }
    }, [data, testCases]);

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <ModalWrapper open={open} onClose={onClose}>
            <Typography variant={"h5"}>Test snippet</Typography>
            <Divider/>
            <Box mt={2} display="flex">
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{borderRight: 1, borderColor: 'divider'}}
                >
                    {testCases?.map((testCase) => (
                        <Tab label={testCase.name}/>
                    ))}
                    <IconButton disableRipple onClick={() => setValue((testCases?.length ?? 0) + 1)}>
                        <AddRounded />
                    </IconButton>
                </Tabs>
                {testCases?.map((testCase, index) => (
                    <TabPanel index={index} value={value} test={testCase}
                              setTestCase={(tc) => postTestCase({tc, snippetId})}
                              removeTestCase={(i) => removeTestCase(i)}
                     snippetId={snippetId}/>
                ))}
                <TabPanel index={(testCases?.length ?? 0) + 1} value={value}
                          setTestCase={(tc) => postTestCase({tc, snippetId})}
                 snippetId={snippetId}/>
            </Box>
        </ModalWrapper>
    )
}
