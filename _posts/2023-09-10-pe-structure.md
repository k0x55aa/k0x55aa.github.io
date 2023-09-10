---
layout: post
title: "Understanding The PE File Format Structure - Part 1"
categories: windows
author:
- k0x55aa
meta: "windows"
---


### Introduction

When we load a CD or pendrive in a computer disc drive, the cpu understands what to do irrespective of the operating system i.e windows or linux. Similarly PE file is the executable file which can be loaded in the windows operating system. And the windows operating system knows what to do with PE file i.e ".exe" file.
Have you wonder what lies behind the windows executable file or PE file ".exe" . There often times, we will come across depending on the work like reversing a windows binary, programming a windows binary, analysing malware etc.
The main goal of this article is to understand the PE file structure and what can we do with the underlying structure of the PE file.
#### Basic PE File Structure
Windows has many flavors (Windows XP, Windows 7, Windows 10) so in order to support for all windows flavors the PE file format was created. To understand the PE format. Lets create a simple PE file PEstructure program in C
```
#include <stdio.h>
int main(int argc, char **argv[])
{
printf("PE File Structure");
return 0;
}
```
Build the program in Visual Studio, PE file will be created i.e PEstructure.exe. Open the file in the PE View or CFF explorer. The PE View of PEstructure.exe mapped with the basic PE structure is depicted below.
Fig. PE File StructureLets dive deep into the each component of the PE file format
DOS MZ Header
The first 64 bytes of the PE file is known as DOS MZ Header which is define in winnt.h or windows.inc . The member of DOS MZ header structure is shown below.
```
typedef struct _IMAGE_DOS_HEADER {      // DOS .EXE header
    WORD   e_magic;                     // Magic number
    WORD   e_cblp;                    // Bytes on last page of file
    WORD   e_cp;                        // Pages in file
    WORD   e_crlc;                      // Relocations
    WORD   e_cparhdr;         // Size of header in paragraphs
    WORD   e_minalloc;        // Minimum extra paragraphs needed
    WORD   e_maxalloc;        // Maximum extra paragraphs needed
    WORD   e_ss;              // Initial (relative) SS value
    WORD   e_sp;                        // Initial SP value
    WORD   e_csum;                      // Checksum
    WORD   e_ip;                        // Initial IP value
    WORD   e_cs;              // Initial (relative) CS value
    WORD   e_lfarlc;          // File address of relocation table
    WORD   e_ovno;                      // Overlay number
    WORD   e_res[4];                    // Reserved words
    WORD   e_oemid;           // OEM identifier (for e_oeminfo)
    WORD   e_oeminfo;         // OEM information; e_oemid specific
    WORD   e_res2[10];                  // Reserved words
    LONG   e_lfanew;          // File address of new exe header
  } IMAGE_DOS_HEADER, *PIMAGE_DOS_HEADER;
  ```
Out of 19 members of the DOS MZ Header e_magic and e_lfanew is of our significant importance.
###### e_magic
It is the first member of DOS MZ Header which is also known as magic number. It is a WORD therefore it consist of first 2 bytes "4D 5A" i.e "MZ". Since Windows is little endian it is stored as "5A 4D" in PE file.
The signature of PE file is "MZ" which stands for "Mark Zbikowski" the man behind the architecture of PE format. It is similar to the signature of other format like pdf → %pdf. This member tell us whether the file is a valid PE file or not.
###### e_lfanew
The last member of the DOS MZ Header is e_lfanew which is a DWORD that means it consist of last 4 bytes of the DOS MZ header. It holds the offset to the start of PE Header. This value is check by the PE loader of the windows system which offset to load for PE Header.
#### DOS Stub
When we run the PEstructure.exe in a 16 bit machine DOSbox, It will prints "This program cannot be run in DOS mode" which is generally and error saying that the PEstructure.exe the main code cannot run in 16 bit msdos.
Now lets try to change the strings of our choice in the hexeditor, We can see our modified text below.
Copy the Dos stub and save it in the new file using hexeditor.
Now lets open the DOS stub in IDA Pro.
The first two line indicates that it is clearing the stack "push cs and pop ds". Next instruction "mov dx, 0Eh" is the location of strings to look for which is stored in register "dx". The instruction "mov ah, 9" prints the string present in "dx" to the commandline "int 21h" is msdos interrupt (API call). The instruction "mov ax, 4c01h" tells to terminate the program.
The best way to modify the dos stub is by writing a program in 16 bit dosbox and build it and link with the program you wanted to use "/STUB:stub.exe".
Takeaway: The Dos stub may sometimes contain useful information especially when we are solving some ctf challenges and which could sometimes only be seen when running in 16 bit msdos machine.
#### Rich Header
The Rich Header is the undocumented section between the DOS stub and PE Header, this header can only be found in Microsoft Visual Studio compile PE file. I didn't knew about this header until I read the article "Devils in the rich header" where the OlympicDestroyer malware writer have embedded a fake header tricking the malware analyst to think that the attack comes from Lazarus group. It generates when we link the machine generate compile object file to an executable with Microsoft Visual studio. The metadata of the tool such as build number, version etc. It starts from offset x80 and ends at ascii string "Rich" followed by a 4 byte checksum & decryption key. After which a 16 byte padding exist before the start of PE header.
#### PE Header/NT Header

The PE header aka NT Header is defined in the winnt.h, the structure of PE header has 3 members, the 32 bit and 64 bit structure is shown below
```
typedef struct _IMAGE_NT_HEADERS {
    DWORD Signature;
    IMAGE_FILE_HEADER FileHeader;
    IMAGE_OPTIONAL_HEADER32 OptionalHeader;
} IMAGE_NT_HEADERS32, *PIMAGE_NT_HEADERS32;
```
#### Signature

The signature of the PE header is a DWORD i.e 4 bytes. Its has a fixed value of "50 45 00 00" in ascii "PE\0\0" which represents the start of the PE header.
File Header
File Header is also known as the COFF header consist of 20 bytes of a PE file holds the information about the physical layout and properties of the PE file such as PointerToSymbolTable, NumberOfSections etc. The structure IMAGE_FILE_HEADER has 7 members in winnt.h as shown below.
```
typedef struct _IMAGE_NT_HEADERS64 {
    DWORD Signature;
    IMAGE_FILE_HEADER FileHeader;
    IMAGE_OPTIONAL_HEADER64 OptionalHeader;
} IMAGE_NT_HEADERS64, *PIMAGE_NT_HEADERS64;

typedef struct _IMAGE_NT_HEADERS {
    DWORD Signature;
    IMAGE_FILE_HEADER FileHeader;
    IMAGE_OPTIONAL_HEADER32 OptionalHeader;
} IMAGE_NT_HEADERS32, *PIMAGE_NT_HEADERS32;
```
###### Machine
This member is a WORD that holds 2 bytes which tells us the information about the types of machine(CPU) i.e 0x8864 for AMD64 and 0x14c for i386
###### NumberOfSections
This members tell us the number of sections present in the section table
###### TimeDateStamp
It tell us the information about the file when it was created.
###### PointerToSymbolTable & NumberOfSymbols
PointerToSymbolTable holds the offset of the entrypoint to the COFF symbol table and NumberOfsymbols holds value of number of entries to the COFF symbol table.
###### SizeOfOptionalHeader
It hold the size of optional header value.
Characteristics: It contains a flag which determines whether the file is PE executable or a dll file. Characteristics
###### Optional Header
When a PE file loader loads the PE file, it requires various information like what address should the loader execute, whether the PE file is a GUI, console, driver etc. All this information can be found in the Optional Header which we discuss. The structure of Optional Header is depicted below.
```
typedef struct _IMAGE_OPTIONAL_HEADER {
    WORD    Magic;
    BYTE    MajorLinkerVersion;
    BYTE    MinorLinkerVersion;
    DWORD   SizeOfCode;
    DWORD   SizeOfInitializedData;
    DWORD   SizeOfUninitializedData;
    DWORD   AddressOfEntryPoint;
    DWORD   BaseOfCode;
    DWORD   BaseOfData;
    DWORD   ImageBase;
    DWORD   SectionAlignment;
    DWORD   FileAlignment;
    WORD    MajorOperatingSystemVersion;
    WORD    MinorOperatingSystemVersion;
    WORD    MajorImageVersion;
    WORD    MinorImageVersion;
    WORD    MajorSubsystemVersion;
    WORD    MinorSubsystemVersion;
    DWORD   Win32VersionValue;
    DWORD   SizeOfImage;
    DWORD   SizeOfHeaders;
    DWORD   CheckSum;
    WORD    Subsystem;
    WORD    DllCharacteristics;
    DWORD   SizeOfStackReserve;
    DWORD   SizeOfStackCommit;
    DWORD   SizeOfHeapReserve;
    DWORD   SizeOfHeapCommit;
    DWORD   LoaderFlags;
    DWORD   NumberOfRvaAndSizes;
    IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES];
} IMAGE_OPTIONAL_HEADER32, *PIMAGE_OPTIONAL_HEADER32;
typedef struct _IMAGE_OPTIONAL_HEADER64 {
    WORD        Magic;
    BYTE        MajorLinkerVersion;
    BYTE        MinorLinkerVersion;
    DWORD       SizeOfCode;
    DWORD       SizeOfInitializedData;
    DWORD       SizeOfUninitializedData;
    DWORD       AddressOfEntryPoint;
    DWORD       BaseOfCode;
    ULONGLONG   ImageBase;
    DWORD       SectionAlignment;
    DWORD       FileAlignment;
    WORD        MajorOperatingSystemVersion;
    WORD        MinorOperatingSystemVersion;
    WORD        MajorImageVersion;
    WORD        MinorImageVersion;
    WORD        MajorSubsystemVersion;
    WORD        MinorSubsystemVersion;
    DWORD       Win32VersionValue;
    DWORD       SizeOfImage;
    DWORD       SizeOfHeaders;
    DWORD       CheckSum;
    WORD        Subsystem;
    WORD        DllCharacteristics;
    ULONGLONG   SizeOfStackReserve;
    ULONGLONG   SizeOfStackCommit;
    ULONGLONG   SizeOfHeapReserve;
    ULONGLONG   SizeOfHeapCommit;
    DWORD       LoaderFlags;
    DWORD       NumberOfRvaAndSizes;
    IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES];
} IMAGE_OPTIONAL_HEADER64, *PIMAGE_OPTIONAL_HEADER64;
```
###### Magic
It tell us about whether the PE file is PE32 , PE32+, ROM image i.e 0x10B = PE32, 0x20B = PE32+, 0x107 = ROM image
MajorLinkerVersion and MinorLinkerVersion : The linker major and minor version numbers.
###### SizeOfCode
It holds the value of the size of the code (text) section, or the sum of all code sections if there are multiple sections.
###### SizeOfUninitializedData
This field holds the size of the uninitialized data section (BSS), or the sum of all such sections if there are multiple BSS sections.
###### AddressOfEntryPoint
It is the address where the execution of file starts when loaded into the memory. We can tell the PE file which section to start as entry point to execute the code. The value is generally used by packers which points the AddressofEntryPoint to the value or the address to the decompression stub of the packer.
###### BaseOfCode
An RVA of the start of the code section when the file is loaded into memory.
BaseOfData (PE32 Only): An RVA of the start of the data section when the file is loaded into memory.
ImageBase: It is the preferred load address of the PE file. Nowadays due to ASLR, the file won't load at the ImageBase address. But if we disable ASLR, 99% of the time the image will load at this address 0x400000 for PE32 executable, 0x140000000 for PE32+
###### SectionAlignment
It is the alignment of sections when loaded into the memory. Eg: If this value contains 0x1000, then each of the section should started with a multiple of 0x1000. If the first section starts at 0x400000 then the next section much be at 0x401000.
FileAlignment: The alignment of sections in the file. If the value of FileAlignment is 0x200, then each of the section should started with multiple of 0x200 i.e 0x400 in the next section.
###### SizeOfImage
The overall size of the PE file when it is loaded into the memory. It is sum of all the headers and the section alignment
###### SizeOfHeaders
It is sum of the size of DOS header, PE headers and Sections Table. Its value is equal to file size minus all the size of sections in the file.
###### Checksum
It is the checksum of the image file.
###### Subsytem
This value tells us about the type of subsytem the file will use once loaded such as 0x3 = console, 0x2 = gui, 0xE = xbox application, etc.
Since this article is getting lengthy, I will try to divide this into two parts. So far we have learned the DOS HEADER, RICH HEADER, PE HEADER, rest of things will be covered in the next part.

Reference

[PE-FORMAT](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format)

[WIN32 PE](https://www.delphibasics.info/home/delphibasicsarticles/anin-depthlookintothewin32portableexecutablefileformat-part1)


