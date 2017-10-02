# general overview / notes
Hopefully hex will be a hexagonal grid based spacial programming system.
So far, here are the general ideas i have for it:
- Hexagonal grid (obviously)
- Each hexagon can have hexcode inside of it
- 1 byte can indicate all directions combinations on a hexagon as well as up and down
- There can be multiple layers of hex grid
- Extra bytes in a hex could be used to execute commands
- Three modes: Edit, Remove, Run
  * in edit mode, the user can click on a hex to edit it's hexcode and other attributes
  * in remove mode, clicking on a hex will clear it
  * in run mode a user can click on a hex to add it to the hex queue
- when a hex runs, it will add hexes to the queue using the direction hex
- the hex queue will be added to in a clock-wise motion starting from the top
- once the current tick's hex queue is empty, the next tick will start with the new queue
- if the next tick's queue is empty, the program will end

- individual hexes may have a background color and border color  for inactive and active states
- individual hexes may have some kind of internal storage
- hexes may be able to acces some kind of global storage
- hexes may be able to access the storage of their neighbors

# opcodes
- Ideally there should be very few op codes, maybe 16 as to fit onto one hexcode
- A neighbor code (NC) is a 1 byte value that refers to any combination of hex neighbors
- a hex stops running when a next is successfully called
- A location (L) is a 4 bit value that refers to a location (self, neighbors, global stacks A-G)
- ACC is the local hex's accumulator
- All processes that read from L read from the top of the stack, like a peek
- Io location consists of two L, for a total of 64kb of memory locations
  * next NC
  * next if zero NC
  * next if greater than zero NC
  * next if less than zero NC
  * add L to ACC
  * sub L to ACC
  * push L from ACC
  * pop L into ACC
  * set val in ACC
  * nxz L NC
  * nxgz L NC
  * nxlz L NC
  * negate the ACC
  * read io location into ACC
  * write io location into ACC
  * nop? I don't think i really need a nop, but there's one here if i need it.

# TODO
 - build a parser for the instruction set
 - build a runner for the grid
 - add a run options panel
